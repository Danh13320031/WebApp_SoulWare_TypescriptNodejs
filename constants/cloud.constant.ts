import "dotenv/config";

export const CLOUDINARY_CLOUD_NAME: string = process.env
  .CLOUDINARY_CLOUD_NAME as string;
export const CLOUDINARY_API_KEY: string = process.env
  .CLOUDINARY_API_KEY as string;
export const CLOUDINARY_API_SECRET: string = process.env
  .CLOUDINARY_API_SECRET as string;
