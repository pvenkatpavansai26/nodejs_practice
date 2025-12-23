// cloudinary.ts
import { v2 as cloudinary } from "cloudinary";
import { config } from "./config.ts"; // ✅ Correct - named export

cloudinary.config({
  cloud_name: config.cloudinarycloud_name!,
  api_key: config.cloudinaryapi_key!,
  api_secret: config.cloudinaryapi_secret!,
});

export default cloudinary;
