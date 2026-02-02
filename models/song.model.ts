import mongoose from "mongoose";
const Schema = mongoose.Schema;

const objSchema = {
  title: { type: String, required: true },
  avatar: { type: String, required: true },
  description: { type: String, required: true },
  like: { type: Number, required: true, default: 0 },
  lyrics: { type: String, required: true },
  audio: { type: String, required: true },
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
  topicId: { type: String, required: true },
  singerId: { type: String, required: true },
};

const SongSchema = new Schema(objSchema, { timestamps: true });
const SongModel = mongoose.model("Song", SongSchema, "Song");

export default SongModel;
