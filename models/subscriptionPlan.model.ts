import mongoose from "mongoose";
const Schema = mongoose.Schema;

export enum ESubscriptionPlanCode {
  FREE = "FREE",
  LIMITED = "LIMITED",
  PREMIUM = "PREMIUM",
}

const objSchema = {
  name: { type: String, required: true },
  code: {
    type: String,
    required: true,
    enum: ["FREE", "LIMITED", "PREMIUM"],
    unique: true,
  },
  description: { type: String, required: false },
  price: { type: Number, required: true, default: 0 },
  durationDays: { type: Number, default: 30 },
  downloadLimit: { type: Number, default: 0 },
  permissions: { type: [String], required: true, default: [] },
  status: {
    type: String,
    required: true,
    enum: ["active", "inactive"],
    default: "active",
  },
  position: { type: Number, required: true, default: 1 },
  deleted: { type: Boolean, required: true, default: false },
  deletedAt: { type: Date, default: null },
};

const SubscriptionPlanSchema = new Schema(objSchema, { timestamps: true });

const SubscriptionPlanModel = mongoose.model(
  "SubscriptionPlan",
  SubscriptionPlanSchema,
  "SubscriptionPlan",
);

export default SubscriptionPlanModel;
