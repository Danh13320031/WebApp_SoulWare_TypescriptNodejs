import mongoose from "mongoose";
import slugify from "slugify";
import SingerModel from "./singer.model";
import TopicModel from "./topic.model";
import SingerGroupModel from "./singerGroup.model";

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
  slug: { type: String, index: true, unique: true },
  position: { type: Number, required: true, default: 1 },
  deleted: { type: Boolean, required: true, default: false },
  deletedAt: { type: Date, default: null },
  topicId: { type: Schema.Types.ObjectId, ref: TopicModel, required: true },
  singers: {
    type: [Schema.Types.ObjectId],
    ref: SingerModel,
    required: false,
  },
  singerGroups: {
    type: [Schema.Types.ObjectId],
    ref: SingerGroupModel,
    required: false,
  },
};

const SongSchema = new Schema(objSchema, { timestamps: true });

SongSchema.pre("save", async function () {
  if (!this.isModified("title")) return;

  const Song = this.constructor as any;

  const baseSlug = slugify(this.title, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  while (await Song.findOne({ slug })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  this.slug = slug;
});

const SongModel = mongoose.model("Song", SongSchema, "Song");

export default SongModel;
