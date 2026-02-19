import { NextFunction, Request, Response } from "express";
import uploadCloudConfig from "../configs/uploadCloud.config";
import uploadToCloudinary from "../helpers/uploadToCloudinary.helper";

uploadCloudConfig();

const uploadSingerField = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const file: any = req.file;
    const result = await uploadToCloudinary(file.buffer);
    req.body[file.fieldname] = result;
  } catch (error) {
    console.log("Upload singer field error::: ", error);
  }

  next();
};

const uploadDiffMultiField = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const fileObj = req.files as any;

  for (const key in fileObj) {
    req.body[key] = [];

    const fileList = fileObj[key];

    for (const file of fileList) {
      try {
        const result = await uploadToCloudinary(file.buffer);
        req.body[key].push(result);
      } catch (error) {
        console.log("Upload diff multi file error::: ", error);
      }
    }
  }

  next();
};

const uploadCloud = { uploadSingerField, uploadDiffMultiField };

export default uploadCloud;
