import mongoose from "mongoose";
import slugify from "slugify";
import SingerModel from "./singer.model";
const Schema = mongoose.Schema;

const objSchema = {
  name: { type: String, required: true },
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
  singers: { type: [Schema.Types.ObjectId], ref: SingerModel, required: true },
};

const SingerGroupSchema = new Schema(objSchema, { timestamps: true });

SingerGroupSchema.pre("save", async function () {
  if (!this.isModified("name")) return;

  const SingerGroup = this.constructor as any;

  let slug = slugify(this.name, { lower: true, strict: true });
  let newSlug = slug;
  let count = 1;

  while (await SingerGroup.findOne({ slug })) {
    slug = `${newSlug}-${count}`;
    count++;
  }

  this.slug = slug;
});

const SingerGroupModel = mongoose.model(
  "SingerGroup",
  SingerGroupSchema,
  "SingerGroup",
);
export default SingerGroupModel;
