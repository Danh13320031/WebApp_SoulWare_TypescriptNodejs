import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import activeSider from "../../helpers/admin/activeSider.helper";
import SingerModel from "../../models/singer.model";
import { TDataBodyCreateSingerGroup } from "../../types/singerGroup.type";
import SingerGroupModel from "../../models/singerGroup.model";

// [GET]: /admin/singer-groups
const singerGroupGet = async (req: Request, res: Response): Promise<void> => {
  try {
    const pathname = activeSider(req.originalUrl);
    let find: any = { deleted: false };

    const singerGroupList = await SingerGroupModel.find(find)
      .sort({
        position: "desc",
      })
      .populate("singers", "fullName stageName");

    res.render("admin/pages/singerGroup/singerGroup.view.ejs", {
      pageTitle: "Danh sách nhóm ca sĩ",
      pathname,
      singerGroupList,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - singerGroupGet",
    });
    return;
  }
};

// [GET]: /admin/singer-groups/create
const createANewSingerGroupGet = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const pathname = activeSider(req.originalUrl);
    let find: any = { deleted: false };

    const singerList = await SingerModel.find(find).select("stageName");

    res.render("admin/pages/singerGroup/create.view.ejs", {
      pageTitle: "Tạo mới nhóm ca sĩ",
      pathname,
      singerList,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - createANewSingerGroupGet",
    });
    return;
  }
};

// [POST]: /admin/singer-groups/create
const createANewSingerGroupPost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const countDocument: number = await SingerGroupModel.countDocuments();
    let avatar: string = "";

    if (req.body.avatar) avatar = req.body.avatar;

    const dataBodyCreateSingerGroup: TDataBodyCreateSingerGroup = {
      avatar: avatar ? avatar : "",
      name: req.body.name ? req.body.name : "",
      description: req.body.description ? req.body.description : null,
      status: req.body.status ? req.body.status : "active",
      position: req.body.position
        ? Number(req.body.position)
        : countDocument + 1,
      singers: req.body.singers ? req.body.singers : [],
    };

    const newSingerGroup = new SingerGroupModel(dataBodyCreateSingerGroup);
    await newSingerGroup.save();

    res.status(StatusCodes.CREATED).json({
      code: StatusCodes.CREATED,
      status: "Success",
      message: "Tạo mới nhóm ca sĩ thành công!",
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - createANewSingerGroupPost",
    });
    return;
  }
};

type TSingerGroupController = {
  singerGroupGet: (req: Request, res: Response) => Promise<void>;
  createANewSingerGroupGet: (req: Request, res: Response) => Promise<void>;
  createANewSingerGroupPost: (req: Request, res: Response) => Promise<void>;
};

const singerGroupController: TSingerGroupController = {
  singerGroupGet,
  createANewSingerGroupGet,
  createANewSingerGroupPost,
};

export default singerGroupController;
