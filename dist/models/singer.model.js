"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
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
    deleted: { type: Boolean, required: true, default: false },
    deletedAt: { type: Date, default: null },
};
const SingerSchema = new Schema(objSchema, { timestamps: true });
const SingerModel = mongoose_1.default.model("Singer", SingerSchema, "Singer");
exports.default = SingerModel;
