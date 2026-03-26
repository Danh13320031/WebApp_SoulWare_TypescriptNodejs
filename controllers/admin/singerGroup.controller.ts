import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import activeSider from "../../helpers/admin/activeSider.helper";

const singerGroupGet = async (req: Request, res: Response): Promise<void> => {
  try {
    const pathname = activeSider(req.originalUrl);

    res.render("admin/pages/singerGroup/singerGroup.view.ejs", {
      pageTitle: "Danh sách nhóm ca sĩ",
      pathname,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - singerGroupGet",
    });
    return;
  }
};

type TSingerGroupController = {
  singerGroupGet: (req: Request, res: Response) => Promise<void>;
};

const singerGroupController: TSingerGroupController = {
  singerGroupGet,
};

export default singerGroupController;
