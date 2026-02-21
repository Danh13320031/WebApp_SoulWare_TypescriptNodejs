"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const singer_model_1 = __importDefault(require("./singer.model"));
const topic_model_1 = __importDefault(require("./topic.model"));
const Schema = mongoose_1.default.Schema;
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
    topicId: { type: Schema.Types.ObjectId, ref: topic_model_1.default, required: true },
    singerId: { type: Schema.Types.ObjectId, ref: singer_model_1.default, required: true },
};
const SongSchema = new Schema(objSchema, { timestamps: true });
SongSchema.pre("save", function () {
    if (this.isModified("title"))
        this.slug = (0, slugify_1.default)(this.title, { lower: true });
});
const SongModel = mongoose_1.default.model("Song", SongSchema, "Song");
exports.default = SongModel;
