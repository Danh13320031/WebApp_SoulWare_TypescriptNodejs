import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import activeSider from "../../helpers/admin/activeSider.helper";

const getAllUserGet = async (req: Request, res: Response) => {
  try {
    const pathname = activeSider(req.originalUrl);

    res.render("admin/pages/user/user.view.ejs", {
      pageTitle: "Quản lý người dùng",
      pathname,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Error",
      message: "Lỗi khi lấy danh sách người dùng",
    });
    return;
  }
};

type IUserController = {
  getAllUserGet: (req: Request, res: Response) => Promise<void>;
};

const userController: IUserController = {
  getAllUserGet,
};

export default userController;
