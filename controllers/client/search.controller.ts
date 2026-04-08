import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import convertTextToSlug from "../../helpers/convertTextToSlug.helper";
import SongModel from "../../models/song.model";

// [GET]: /search/:type
const getAllSearchResultGet = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const type: string = req.params.type as string;
  const keyword: string = (req.query.keyword as string) || "";
  let newSearchedSongList: any[] = [];

  if (keyword) {
    const keywordRegex = new RegExp(keyword, "i");
    const slug = convertTextToSlug(keyword);
    const slugRegex = new RegExp(slug, "i");

    const searchedSongList = await SongModel.find({
      $or: [
        { title: { $regex: keywordRegex } },
        { slug: { $regex: slugRegex } },
      ],
      status: "active",
      deleted: false,
    })
      .select("title avatar singers slug like")
      .populate("singers", "stageName slug")
      .populate("singerGroups", "name slug")
      .populate("topicId", "title slug");

    newSearchedSongList = searchedSongList;
  }

  switch (type) {
    case "result":
      res.render("client/pages/search/search.view.ejs", {
        pageTitle: `Kết quả tìm kiếm: ${keyword}`,
        keyword,
        newSearchedSongList,
      });
      break;
    case "suggest":
      res.json({
        code: StatusCodes.OK,
        status: "Success",
        data: newSearchedSongList,
      });
      break;
    default:
      break;
  }
};

type ISearchController = {
  getAllSearchResultGet: (req: Request, res: Response) => Promise<void>;
};

const searchController: ISearchController = {
  getAllSearchResultGet,
};

export default searchController;
