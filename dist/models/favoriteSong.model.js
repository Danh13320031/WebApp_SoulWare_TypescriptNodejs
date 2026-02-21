"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const objSchema = {
    songId: { type: Schema.Types.ObjectId, ref: "Song", required: true },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
        default: null,
    },
    status: {
        type: String,
        required: true,
        enum: ["active", "inactive"],
        default: "active",
    },
    deleted: { type: Boolean, required: true, default: false },
    deletedAt: { type: Date, default: null },
};
const FavoriteSongSchema = new Schema(objSchema, { timestamps: true });
const FavoriteSongModel = mongoose_1.default.model("FavoriteSong", FavoriteSongSchema, "FavoriteSong");
exports.default = FavoriteSongModel;
