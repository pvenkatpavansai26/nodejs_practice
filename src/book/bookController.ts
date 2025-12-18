import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import fs from "fs/promises";
import cloudinary from "../config/cloudinary.ts";
import bookModel from "./bookModel.ts";
import type { Auth } from "../middleware/authenticate.ts";

type MulterFiles = { [fieldname: string]: Express.Multer.File[] };

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    console.log("==== createBook HIT ====");
 
    try {
    const { title, genre } = req.body;
    const files = req.files as MulterFiles | undefined;

    console.log("Body:", req.body);
    console.log("Files:", files);

    if (!title || !genre) {
      return next(createHttpError(400, "Title and genre are required"));
    }

    if (!files?.coverImage?.[0] || !files?.bookFile?.[0]) {
      return next(
        createHttpError(400, "Cover image and book file are required")
      );
    }

    const coverImage = files.coverImage[0];
    const bookFile = files.bookFile[0];

    const coverUploadResult = await cloudinary.uploader.upload(
      coverImage.path,
      {
        folder: "BookCovers",
      }
    );

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
      author: _req.userId, // replace with real author id from req
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
    return next(
      createHttpError(500, `Failed to create book: ${err.message}`)
    );
  }
};

export { createBook };
