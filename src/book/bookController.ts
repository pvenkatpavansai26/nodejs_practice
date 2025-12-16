import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";


const createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, genre } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

        console.log('Body:', req.body);
        console.log('Files:', files);

        // Validate required text fields
        if (!title || !genre) {
            return next(createHttpError(400, "Title and genre are required"));
        }

        // Optional: validate that files were uploaded
        if (!files || !files.coverImage || !files.bookFile) {
            return next(createHttpError(400, "Cover image and book file are required"));
        }

        // Files are successfully uploaded and stored in dest folder
        res.json({ 
            message: "Book created successfully",
            data: {
                title,
                genre,
                coverImage: files.coverImage[0]?.filename,
                bookFile: files.bookFile[0]?.filename
            }
        });
    } catch (error) {
        console.error('Error creating book:', error);
        return next(createHttpError(500, "Failed to create book"));
    }
};

export { createBook };
