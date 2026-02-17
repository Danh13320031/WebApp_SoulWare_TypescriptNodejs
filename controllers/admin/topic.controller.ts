import { Request, Response } from "express";
import TopicModel from "../../models/topic.model";

const getAllTopicGet = async (req: Request, res: Response): Promise<void> => {
  const topicList = await TopicModel.find({
    deleted: false,
  }).select("-deleted -description");

  res.render("admin/pages/topic/topic.view.ejs", {
    pageTitle: "Danh sách chủ đề",
    topicList,
  });
};

type ITopicController = {
  getAllTopicGet: (req: Request, res: Response) => Promise<void>;
};

export const topicController: ITopicController = {
  getAllTopicGet,
};

export default topicController;
