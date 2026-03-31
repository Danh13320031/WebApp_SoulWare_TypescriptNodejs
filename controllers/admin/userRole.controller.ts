import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import activeSider from "../../helpers/admin/activeSider.helper";

const getAllUserRoleGet = async (req: Request, res: Response) => {
  try {
    const pathname = activeSider(req.originalUrl);

    res.render("admin/pages/userRole/userRole.view.ejs", {
      pageTitle: "Danh sách vai trò người dùng",
      pathname,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Lỗi khi lấy danh sách vai trò người dùng",
    });
    return;
  }
};

type TUserRoleController = {
  getAllUserRoleGet: (req: Request, res: Response) => Promise<void>;
};

const UserRoleController: TUserRoleController = {
  getAllUserRoleGet,
};

export default UserRoleController;
