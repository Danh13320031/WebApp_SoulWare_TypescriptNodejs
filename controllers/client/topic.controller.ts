import { Request, Response } from "express";
import TopicModel from "../../models/topic.model";

// [GET]: /topics
const getAllTopicGet = async (req: Request, res: Response): Promise<any> => {
  const topicList = await TopicModel.find({
    deleted: false,
    status: "active",
  });

  console.log("List topic::: ", topicList);

  res.render("client/pages/topic/topic.view.ejs", {
    pageTitle: "Chủ đề bài hát",
    topicList,
  });
};

type ITopicController = {
  getAllTopicGet: (req: Request, res: Response) => Promise<any>;
};

const topicController: ITopicController = {
  getAllTopicGet,
};

export default topicController;
