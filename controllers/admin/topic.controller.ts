import { Request, Response } from "express";

const getAllTopicGet = async (req: Request, res: Response): Promise<void> => {
  res.render("admin/pages/topic/topic.view.ejs", {
    pageTitle: "Danh sách chủ đề",
  });
};

type ITopicController = {
  getAllTopicGet: (req: Request, res: Response) => Promise<void>;
};

export const topicController: ITopicController = {
  getAllTopicGet,
};

export default topicController;
