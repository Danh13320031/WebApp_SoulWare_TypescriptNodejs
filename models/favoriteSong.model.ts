import mongoose from "mongoose";
const Schema = mongoose.Schema;

const objSchema = {
  songId: { type: Schema.Types.ObjectId, ref: "Song", required: true },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
    default: null,
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "inactive"],
    default: "active",
  },
  deleted: { type: Boolean, required: true, default: false },
  deletedAt: { type: Date, default: null },
};

const FavoriteSongSchema = new Schema(objSchema, { timestamps: true });
const FavoriteSongModel = mongoose.model(
  "FavoriteSong",
  FavoriteSongSchema,
  "FavoriteSong",
);

export default FavoriteSongModel;
