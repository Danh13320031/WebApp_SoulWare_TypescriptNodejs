import { Request, Response } from "express";
import TopicModel from "../../models/topic.model";
import SongModel from "../../models/song.model";
import { StatusCodes } from "http-status-codes";

// [GET]: /topics
const getAllTopicGet = async (req: Request, res: Response): Promise<void> => {
  try {
    let find: any = { deleted: false, status: "active" };

    const topicList = await TopicModel.find(find);
    const songList = await SongModel.find(find)
      .select("title avatar singers singerGroups slug topicId")
      .populate("singers", "stageName slug")
      .populate("topicId", "title slug")
      .populate("singerGroups", "name slug");

    res.render("client/pages/topic/topic.view.ejs", {
      pageTitle: "Chủ đề bài hát",
      topicList,
      songList,
      keyword: "",
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - Cannot get topic list",
    });
    return;
  }
};

type ITopicController = {
  getAllTopicGet: (req: Request, res: Response) => Promise<void>;
};

const topicController: ITopicController = {
  getAllTopicGet,
};

export default topicController;
