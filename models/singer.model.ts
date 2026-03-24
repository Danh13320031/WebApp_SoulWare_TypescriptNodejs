import mongoose from "mongoose";
const Schema = mongoose.Schema;

const objSchema = {
  fullName: { type: String, required: true },
  stageName: { type: String, required: false },
  avatar: { type: String, required: true },
  description: { type: String, required: true },
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
};

const SingerSchema = new Schema(objSchema, { timestamps: true });
const SingerModel = mongoose.model("Singer", SingerSchema, "Singer");

export default SingerModel;
