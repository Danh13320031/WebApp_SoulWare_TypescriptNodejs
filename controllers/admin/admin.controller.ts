import { Request, Response } from "express";

// [GET]: /admin/admin
const adminGet = async (req: Request, res: Response): Promise<void> => {
  res.render("admin/pages/admin/admin.view.ejs", {
    pageTitle: "Danh sách quản trị viên",
  });
};

type TAdminController = {
  adminGet: (req: Request, res: Response) => Promise<void>;
};

export const adminController: TAdminController = {
  adminGet,
};

export default adminController;
