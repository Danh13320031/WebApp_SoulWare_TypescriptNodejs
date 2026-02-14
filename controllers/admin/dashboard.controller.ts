import { Request, Response } from "express";

const dashboardGet = async (req: Request, res: Response): Promise<void> => {
  res.render("admin/pages/dashboard/dashboard.view.ejs", {
    pageTitle: "Trang tổng quan",
  });
};

type IDashboardController = {
  dashboardGet: (req: Request, res: Response) => Promise<void>;
};

export const dashboardController: IDashboardController = {
  dashboardGet,
};

export default dashboardController;
