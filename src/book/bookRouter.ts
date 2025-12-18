import express from "express"
import { createBook, updateBook } from "./bookController.ts";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import authenticate from "../middleware/authenticate.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bookRouter = express.Router();

// Ensure upload directory exists
const uploadDir = path.resolve(__dirname, '../../public/data/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Create unique filename
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

bookRouter.post("/", 
    authenticate,
    upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "bookFile", maxCount: 1 }
]), createBook);     

bookRouter.patch("/:id", 
    authenticate,
    upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "bookFile", maxCount: 1 }
]), updateBook); 

export default bookRouter;