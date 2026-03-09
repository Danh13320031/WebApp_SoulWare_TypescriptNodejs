import { Request, Response } from "express";
import TopicModel from "../../models/topic.model";
import { StatusCodes } from "http-status-codes";
import { TDataBodyCreateTopic } from "../../types/topic.type";

// [GET]: /admin/topics
const getAllTopicGet = async (req: Request, res: Response): Promise<void> => {
  let find: any = { deleted: false };

  const topicList = await TopicModel.find(find).select("-deleted -description");

  res.render("admin/pages/topic/topic.view.ejs", {
    pageTitle: "Danh sách chủ đề",
    topicList,
  });
};

// [GET]: /admin/topics/create
const createANewTopicGet = async (
  req: Request,
  res: Response,
): Promise<void> => {
  res.render("admin/pages/topic/create.view.ejs", {
    pageTitle: "Thêm mới chủ đề",
  });
};

// [POST]: /admin/songs/create
const createANewTopicPost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const countDocument = await TopicModel.countDocuments();
    let avatar: string = "";

    if (req.body.avatar) avatar = req.body.avatar[0];

    const dataBodyCreateTopic: TDataBodyCreateTopic = {
      title: req.body.title ? req.body.title : "",
      avatar: avatar,
      description: req.body.description || "",
      position: req.body.position
        ? Number(req.body.position)
        : countDocument + 1,
      status: req.body.status || "active",
    };

    const newSong = new TopicModel(dataBodyCreateTopic);
    await newSong.save();

    res.status(StatusCodes.CREATED).json({
      code: StatusCodes.CREATED,
      status: "Success",
      message: "Tạo chủ đề thành công!",
    });
    return;
  } catch (error) {
    console.error("Lỗi hệ thống::: ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Lỗi hệ thống",
    });
    return;
  }
};

type TTopicController = {
  getAllTopicGet: (req: Request, res: Response) => Promise<void>;
  createANewTopicGet: (req: Request, res: Response) => Promise<void>;
  createANewTopicPost: (req: Request, res: Response) => Promise<void>;
};

export const topicController: TTopicController = {
  getAllTopicGet,
  createANewTopicGet,
  createANewTopicPost,
};

export default topicController;
