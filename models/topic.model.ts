import mongoose from "mongoose";
import slugify from "slugify";
const Schema = mongoose.Schema;

const objSchema = {
  title: { type: String, required: true },
  avatar: { type: String, required: true },
  description: { type: String, required: true },
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

const TopicSchema = new Schema(objSchema, { timestamps: true });

TopicSchema.pre("save", async function () {
  if (!this.isModified("title")) return;

  const Topic = this.constructor as any;

  let slug = slugify(this.title, { lower: true, strict: true });
  let newSlug = slug;
  let count = 1;

  while (await Topic.findOne({ slug: newSlug })) {
    newSlug = `${slug}-${count}`;
    count++;
  }

  this.slug = newSlug;
});

const TopicModel = mongoose.model("Topic", TopicSchema, "Topic");

export default TopicModel;
