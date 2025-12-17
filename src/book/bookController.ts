import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "../config/cloudinary.ts"; 

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
            return next(createHttpError(400, "Title and genre are required"));
        }

        // Validate required files
        if (!files?.coverImage?.[0] || !files?.bookFile?.[0]) {
            return next(createHttpError(400, "Cover image and book file are required"));
        }

        const coverImage = files.coverImage[0];
        const coverImageMimeType = coverImage.mimetype.split('/').at(-1)!;
        const fileName = coverImage.filename!;
        const fileURLToPath = path.resolve(__dirname, '../../public/data/uploads', fileName);

  
        const uploadResult = await cloudinary.uploader.upload(fileURLToPath, {
            filename_override: fileName,
            format: coverImageMimeType,
            folder: "BookCovers"
        });
        const bookFile = files.bookFile[0];
        const bookFileMimeType = bookFile.mimetype.split('/').at(-1)!;
        const bookFileName = bookFile.filename!;
        const bookFilePath = path.resolve(__dirname, '../../public/data/uploads', bookFileName);
        
        const bookUploadResult = await cloudinary.uploader.upload(bookFilePath, {
            filename_override: bookFileName,
            format: bookFileMimeType,
            folder: "BookFiles",
            resource_type: "raw"  
        });

        res.json({ 
            message: "Book created successfully",
            data: {
                title,
                genre,
                coverImage: uploadResult.secure_url,  
                bookFile: bookUploadResult.secure_url   
            }
        });
    } catch (error) {
        console.error('Error creating book:', error);
        return next(createHttpError(500, "Failed to create book"));
    }
};

export { createBook };
