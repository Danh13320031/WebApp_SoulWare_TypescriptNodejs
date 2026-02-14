import mongoose from "mongoose";
import SingerModel from "./singer.model";
import TopicModel from "./topic.model";
const Schema = mongoose.Schema;

const objSchema = {
  title: { type: String, required: true },
  avatar: { type: String, required: true },
  description: { type: String, required: true },
  like: { type: Number, required: true, default: 0 },
  lyrics: { type: String, required: true },
  audio: { type: String, required: true },
  listen: { type: Number, required: true, default: 0 },
  status: {
    type: String,
    required: true,
    enum: ["active", "inactive"],
    default: "active",
  },
  slug: { type: String, required: true },
  position: { type: Number, required: true, default: 1 },
  deleted: { type: Boolean, required: true, default: false },
  deletedAt: { type: Date, default: null },
  topicId: { type: Schema.Types.ObjectId, ref: TopicModel, required: true },
  singerId: { type: Schema.Types.ObjectId, ref: SingerModel, required: true },
};

const SongSchema = new Schema(objSchema, { timestamps: true });
const SongModel = mongoose.model("Song", SongSchema, "Song");

export default SongModel;
