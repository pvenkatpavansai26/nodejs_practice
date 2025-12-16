import express from "express"
import { createBook } from "./bookController.ts";
import multer from "multer";
import path from "path/win32";

const bookRouter = express.Router();

const upload = multer({ 
    dest: path.resolve(__dirname, '../../public/data/uploads'),


});



bookRouter.post("/", upload.fields([{ name: "coverImage", maxCount: 1 },
{ name: "bookFile", maxCount: 1 }
]), createBook);     


export default bookRouter;