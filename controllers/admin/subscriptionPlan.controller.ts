import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import activeSider from "../../helpers/admin/activeSider.helper";
import SubscriptionPlanModel from "../../models/subscriptionPlan.model";

const getAllSubscriptionPlanGet = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const pathname = activeSider(req.originalUrl);
    let find: any = { deleted: false };
    const subscriptionPlanList = await SubscriptionPlanModel.find(find);

    res.render("admin/pages/subscriptionPlan/subscriptionPlan.view.ejs", {
      pageTitle: "Danh sách gói dịch vụ",
      pathname,
      subscriptionPlanList,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - get all subscription plans",
    });
  }
};

type TSubscriptionPlanController = {
  getAllSubscriptionPlanGet: (req: Request, res: Response) => Promise<void>;
};

const subscriptionPlanController: TSubscriptionPlanController = {
  getAllSubscriptionPlanGet,
};

export default subscriptionPlanController;
