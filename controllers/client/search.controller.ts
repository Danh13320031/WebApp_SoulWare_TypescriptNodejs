import { Request, Response } from "express";

// [GET]: /search/result
const getAllSearchResultGet = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const keyword: string = (req.query.keyword as string) || "";

  res.render("client/pages/search/search.view.ejs", {
    pageTitle: `Kết quả tìm kiếm: ${keyword}`,
    keyword,
  });
};

type ISearchController = {
  getAllSearchResultGet: (req: Request, res: Response) => Promise<void>;
};

const searchController: ISearchController = {
  getAllSearchResultGet,
};

export default searchController;
