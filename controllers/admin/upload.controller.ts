import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

// [POST]: /admin/upload
const uploadImageFromTinyMce = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    let fileUrl: string = "";
    if (req.body.file) fileUrl = req.body.file;

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      status: "Success",
      message: "Upload image form TinyMCE successfully",
      data: {
        location: fileUrl,
      },
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - upload image form TinyMCE",
    });
    return;
  }
};

type TypeUploadController = {
  uploadImageFromTinyMce: (req: Request, res: Response) => Promise<void>;
};

const uploadController: TypeUploadController = {
  uploadImageFromTinyMce,
};

export default uploadController;
