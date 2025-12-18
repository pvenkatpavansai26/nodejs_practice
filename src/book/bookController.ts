import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import fs from "fs/promises";
import cloudinary from "../config/cloudinary.ts";
import bookModel from "./bookModel.ts";
import type { Auth } from "../middleware/authenticate.ts";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    console.log("==== createBook HIT ====");
    
    try {
        const { title, genre } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        console.log("Body:", req.body);
        console.log("Files:", files);

        if (!title || !genre) {
            return next(createHttpError(400, "Title and genre are required"));
        }

        if (!files?.coverImage?.[0] || !files?.bookFile?.[0]) {
            return next(createHttpError(400, "Cover image and book file are required"));
        }

        const coverImage = files.coverImage[0]!;
        const bookFile = files.bookFile[0]!;

        const coverUploadResult = await cloudinary.uploader.upload(coverImage.path, {
            folder: "BookCovers",
        });

        const bookUploadResult = await cloudinary.uploader.upload(bookFile.path, {
            folder: "BookFiles",
            resource_type: "raw",
        });

        const _req = req as Auth;
        if (!_req.userId) {
            return next(createHttpError(401, "User not authenticated"));
        }

        const newBook = await bookModel.create({
            title,
            author: _req.userId,
            genre,
            coverImage: coverUploadResult.secure_url,
            file: bookUploadResult.secure_url,
        });

        try {
            await fs.unlink(coverImage.path);
            await fs.unlink(bookFile.path);
        } catch (err) {
            console.log("Error deleting local files:", err);
        }

        res.status(201).json({
            id: newBook._id,
            message: "Book created successfully",
            data: newBook,
        });
    } catch (error) {
        const err = error instanceof Error ? error : new Error("Unknown error");
        console.error("Error creating book:", err);
        return next(createHttpError(500, `Failed to create book: ${err.message}`));
    }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
    const { title, genre } = req.body;
    const id = req.params.id as string;

    const book = await bookModel.findById(id);
    if (!book) {
        return next(createHttpError(404, "Book not found"));
    }

    const _req = req as Auth;
    if (book.author.toString() !== _req.userId) {
        return next(createHttpError(403, "You are not authorized to update this book"));
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let completeCoverImage = book.coverImage;  // ✅ Default to existing
    let completeBookFile = book.file;

    if (files?.coverImage?.[0]) {
        const filePath = files.coverImage[0]!.path;  // ✅ Multer path - NO __dirname!
        //const _coverMimeType = files.coverImage[0]!.mimetype.split('/').at(1);
        
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            folder: "BookCovers",
        });
        completeCoverImage = uploadResult.secure_url;
        await fs.unlink(filePath);
    }

    if (files?.bookFile?.[0]) {
        const filePath = files.bookFile[0]!.path;  // ✅ Multer path - NO __dirname!
        //const _bookMimeType = files.bookFile[0]!.mimetype.split('/').at(1);
        
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            folder: "BookFiles",
            resource_type: "raw",
        });
        completeBookFile = uploadResult.secure_url;
        await fs.unlink(filePath);
    }

    const updatedBook = await bookModel.findByIdAndUpdate(
        id,
        { 
            title: title || book.title,
            genre: genre || book.genre,
            coverImage: completeCoverImage,
            file: completeBookFile 
        },
        { new: true }
    );

    res.json(updatedBook);
};

const listBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const books = await bookModel.find();
        res.json(books);
    }
    catch (error) {
        return next(createHttpError(500, "Failed to list books"));
    }
};
export { createBook, updateBook, listBooks };