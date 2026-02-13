import { Request, Response } from "express";
import TopicModel from "../../models/topic.model";

// [GET]: /topics
const getAllTopicGet = async (req: Request, res: Response): Promise<void> => {
  const topicList = await TopicModel.find({
    deleted: false,
    status: "active",
  });

  res.render("client/pages/topic/topic.view.ejs", {
    pageTitle: "Chủ đề bài hát",
    topicList,
    keyword: "",
  });
};

type ITopicController = {
  getAllTopicGet: (req: Request, res: Response) => Promise<void>;
};

const topicController: ITopicController = {
  getAllTopicGet,
};

export default topicController;
