import { Request, Response } from "express";
import activeSider from "../../helpers/admin/activeSider.helper";

// [GET]: /admin/dashboard
const dashboardGet = async (req: Request, res: Response): Promise<void> => {
  const pathname = activeSider(req.originalUrl);

  res.render("admin/pages/dashboard/dashboard.view.ejs", {
    pageTitle: "Trang tổng quan",
    pathname,
  });
};

type TDashboardController = {
  dashboardGet: (req: Request, res: Response) => Promise<void>;
};

export const dashboardController: TDashboardController = {
  dashboardGet,
};

export default dashboardController;
