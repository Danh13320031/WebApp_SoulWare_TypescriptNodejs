import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import activeSider from "../../helpers/admin/activeSider.helper";
import SingerModel from "../../models/singer.model";

// [GET]: /admin/singers
const getAllSingerGet = async (req: Request, res: Response): Promise<void> => {
  try {
    const pathname = activeSider(req.originalUrl);
    let find: any = { deleted: false };

    const singerList = await SingerModel.find(find).select(
      "-deleted -deletedAt -createdAt -updatedAt -slug -__v",
    );

    res.render("admin/pages/singer/singer.view.ejs", {
      pageTitle: "Danh sách ca sĩ",
      pathname,
      singerList,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - getAllSinger",
    });
    return;
  }
};

type TSingerController = {
  getAllSingerGet: (req: Request, res: Response) => Promise<void>;
};

const singerController: TSingerController = {
  getAllSingerGet,
};

export default singerController;
