import SongModel from "../models/song.model";

const handleSearch = async (keywordRegex: RegExp, slugRegex: RegExp) => {
  const searchedSongList = await SongModel.find({
    $or: [{ title: { $regex: keywordRegex } }, { slug: { $regex: slugRegex } }],
    status: "active",
    deleted: false,
  }).select("title slug");

  return searchedSongList;
};

export default handleSearch;
