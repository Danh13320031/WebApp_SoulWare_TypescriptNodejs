import mongoose from "mongoose";
const Schema = mongoose.Schema;

const objSchema = {
  title: { type: String, required: true },
  avatar: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
    required: true,
  },
  slug: { type: String, required: true },
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
};

const TopicSchema = new Schema(objSchema, { timestamps: true });
const TopicModel = mongoose.model("Topic", TopicSchema, "Topic");

export default TopicModel;
