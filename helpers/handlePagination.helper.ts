import SongModel from "../models/song.model";
import TopicModel from "../models/topic.model";
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
  count: number,
): Promise<IPagination> => {
  const currentPage: number = page ? page : 1;
  const limitPage: number = limit ? limit : 10;
  const skipPage: number = (currentPage - 1) * limitPage;
  let totalItem: number = count;

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
