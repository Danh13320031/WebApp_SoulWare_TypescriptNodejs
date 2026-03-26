import mongoose from "mongoose";
import slugify from "slugify";
import SingerGroupModel from "./singerGroup.model";
const Schema = mongoose.Schema;

const objSchema = {
  fullName: { type: String, required: true },
  stageName: { type: String, required: false },
  avatar: { type: String, required: true },
  description: { type: String, required: false },
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
};

const SingerSchema = new Schema(objSchema, { timestamps: true });

SingerSchema.pre("save", async function () {
  if (!this.isModified("fullName")) return;

  const Singer = this.constructor as any;

  const baseSlug = slugify(this.fullName, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  while (await Singer.findOne({ slug })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  this.slug = slug;
});

const SingerModel = mongoose.model("Singer", SingerSchema, "Singer");

export default SingerModel;
