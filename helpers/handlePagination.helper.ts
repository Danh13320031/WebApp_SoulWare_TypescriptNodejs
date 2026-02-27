import SongModel from "../models/song.model";
import { TPagination } from "../types/index.type";

interface IPagination {
  currentPage: number;
  limitPage: number;
  skipPage: number;
  totalItem: number;
  totalPage: number;
}

const handlePagination = async (
  page: number,
  limit: number,
  type: string,
): Promise<IPagination> => {
  const currentPage = page ? page : 1;
  const limitPage = limit ? limit : 10;
  const skipPage = (currentPage - 1) * limitPage;
  const totalItem = await SongModel.countDocuments({ deleted: false });
  const totalPage = Math.ceil(totalItem / limitPage);

  const pagination: TPagination = {
    currentPage,
    limitPage,
    skipPage,
    totalItem,
    totalPage,
    type,
  };

  return pagination;
};

export default handlePagination;
