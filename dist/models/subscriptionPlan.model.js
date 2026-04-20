"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ESubscriptionPlanCode = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
var ESubscriptionPlanCode;
(function (ESubscriptionPlanCode) {
    ESubscriptionPlanCode["FREE"] = "FREE";
    ESubscriptionPlanCode["LIMITED"] = "LIMITED";
    ESubscriptionPlanCode["PREMIUM"] = "PREMIUM";
})(ESubscriptionPlanCode || (exports.ESubscriptionPlanCode = ESubscriptionPlanCode = {}));
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
const SubscriptionPlanModel = mongoose_1.default.model("SubscriptionPlan", SubscriptionPlanSchema, "SubscriptionPlan");
exports.default = SubscriptionPlanModel;
