import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import path from "node:path";
import { fileURLToPath } from "url";
import fs from "fs";
import cloudinary from "../config/cloudinary.ts"; 
import bookModel from "../book/bookModel.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, genre } = req.body;  
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        console.log('Body:', req.body);
        console.log('Files:', files);

        // Validate required text fields
        if (!title || !genre) {  
            return next(createHttpError(400, "Title, and genre are required"));
        }

        // Validate required files
        if (!files?.coverImage?.[0] || !files?.bookFile?.[0]) {
            return next(createHttpError(400, "Cover image and book file are required"));
        }

        const coverImage = files.coverImage[0];
        const bookFile = files.bookFile[0];

        // Upload cover image to Cloudinary
        const coverImageMimeType = coverImage.mimetype.split('/').at(-1)!;
        const coverFileName = coverImage.filename!;
        const coverFilePath = path.resolve(__dirname, '../../public/data/uploads', coverFileName);
        
        const uploadResult = await cloudinary.uploader.upload(coverFilePath, {
            filename_override: coverFileName,
            format: coverImageMimeType,
            folder: "BookCovers"
        });

        // Upload book file to Cloudinary
        const bookFileMimeType = bookFile.mimetype.split('/').at(-1)!;
        const bookFileName = bookFile.filename!;
        const bookFilePath = path.resolve(__dirname, '../../public/data/uploads', bookFileName);
        
        const bookUploadResult = await cloudinary.uploader.upload(bookFilePath, {
            filename_override: bookFileName,
            format: bookFileMimeType,
            folder: "BookFiles",
            resource_type: "raw"
        });

        // SAVE TO DATABASE (matches your schema)
        const newBook = await bookModel.create({
            title,
            author: "64f8b1234567890abcdef123",  
            genre,
            coverImage: uploadResult.secure_url,
            file: bookUploadResult.secure_url 
        });
      try{
        await fs.promises.unlink(coverFilePath);
      await fs.promises.unlink(bookFilePath);
      }
        catch(err){
        console.log('Error deleting local files:', err);
        }

        res.status(201).json({ 
            id: newBook._id,
            message: "Book created successfully",
            data: newBook
        });
    } catch (error) {
        console.log('Error creating book:', error);
        return next(createHttpError(500, `Failed to create book`));
    }
};

export { createBook };
