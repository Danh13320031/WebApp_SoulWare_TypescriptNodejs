import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { APP_ADMIN_PAGINATION_LIMIT } from "../../constants/app.constant";
import activeSider from "../../helpers/admin/activeSider.helper";
import handlePagination from "../../helpers/handlePagination.helper";
import SingerModel from "../../models/singer.model";
import { TPagination } from "../../types/index.type";
import { TDataBodyCreateSinger } from "../../types/signer.type";
import convertTextToSlug from "../../helpers/convertTextToSlug.helper";

// [GET]: /admin/singers
const getAllSingerGet = async (req: Request, res: Response): Promise<void> => {
  try {
    const pathname = activeSider(req.originalUrl);
    let find: any = { deleted: false };

    // Handle pagination
    let page: number = 1;
    let limit: number = APP_ADMIN_PAGINATION_LIMIT;
    let type: string = "";

    if (req.query.page) page = Number(req.query.page);
    if (req.query.limit) limit = Number(req.query.limit);
    if (req.query.type) type = req.query.type as string;

    const count = await SingerModel.countDocuments(find);

    const pagination: TPagination = await handlePagination(
      page,
      limit,
      type,
      count,
    );

    // Handle search filter
    let keyword: string = "";
    let keywordRegex: RegExp = new RegExp("", "i");
    let slugRegex: RegExp = new RegExp("", "i");

    if (req.query.keyword) keyword = req.query.keyword as string;
    if (keyword) {
      keywordRegex = new RegExp(keyword, "i");
      slugRegex = new RegExp(convertTextToSlug(keyword), "i");

      find = {
        ...find,
        $or: [
          { fullName: { $regex: keywordRegex } },
          { slug: { $regex: slugRegex } },
        ],
      };
    }

    const singerList = await SingerModel.find(find)
      .select("-deleted -deletedAt -createdAt -updatedAt -slug -__v")
      .sort({ position: "desc" })
      .skip(pagination.skipPage)
      .limit(pagination.limitPage);

    res.render("admin/pages/singer/singer.view.ejs", {
      pageTitle: "Danh sách ca sĩ",
      pathname,
      singerList,
      pagination,
      keyword,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - getAllSinger",
    });
    return;
  }
};

// [GET]: /admin/singers/create
const createANewSingerGet = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const pathname = activeSider(req.originalUrl);

    res.render("admin/pages/singer/create.view.ejs", {
      pageTitle: "Tạo mới ca sĩ",
      pathname,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - createANewSinger",
    });
    return;
  }
};

// [POST]: /admin/singers/create
const createANewSingerPost = async (req: Request, res: Response) => {
  try {
    const countDocument = await SingerModel.countDocuments();
    let avatar: string = "";
    let fullName: string = "";

    if (req.body.avatar) avatar = req.body.avatar;
    if (req.body.name) fullName = req.body.name;

    const dataBodyCreateSinger: TDataBodyCreateSinger = {
      avatar: avatar ? avatar : "",
      fullName: fullName ? fullName : "",
      stageName: req.body.stageName ? req.body.stageName : "",
      description: req.body.description ? req.body.description : null,
      status: req.body.status ? req.body.status : "active",
      position: req.body.position
        ? Number(req.body.position)
        : countDocument + 1,
    };

    const newSinger = new SingerModel(dataBodyCreateSinger);
    await newSinger.save();

    res.status(StatusCodes.CREATED).json({
      code: StatusCodes.CREATED,
      status: "Success",
      message: "Tạo mới ca sĩ thành công!",
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "Fail",
      message: "Server error - createANewSinger",
    });
    return;
  }
};

type TSingerController = {
  getAllSingerGet: (req: Request, res: Response) => Promise<void>;
  createANewSingerGet: (req: Request, res: Response) => Promise<void>;
  createANewSingerPost: (req: Request, res: Response) => Promise<void>;
};

const singerController: TSingerController = {
  getAllSingerGet,
  createANewSingerGet,
  createANewSingerPost,
};

export default singerController;
