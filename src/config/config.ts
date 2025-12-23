import { config as conf } from "dotenv";
//import cloudinary from './cloudinary.ts';

conf();

const _config = {
  port: process.env.PORT,
  databaseUrl: process.env.mongo_connection_string,
  cloudinarycloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryapi_key: process.env.CLOUDINARY_API_KEY,
  cloudinaryapi_secret: process.env.CLOUDINARY_API_SECRET,
};

export const config = Object.freeze(_config);
