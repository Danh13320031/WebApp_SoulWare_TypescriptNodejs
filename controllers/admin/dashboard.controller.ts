import { Request, Response } from "express";

// [GET]: /admin/dashboard
const dashboardGet = async (req: Request, res: Response): Promise<void> => {
  res.render("admin/pages/dashboard/dashboard.view.ejs", {
    pageTitle: "Trang tổng quan",
  });
};

type TDashboardController = {
  dashboardGet: (req: Request, res: Response) => Promise<void>;
};

export const dashboardController: TDashboardController = {
  dashboardGet,
};

export default dashboardController;
