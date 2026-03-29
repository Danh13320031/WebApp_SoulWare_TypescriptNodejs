"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const singer_model_1 = __importDefault(require("./singer.model"));
const topic_model_1 = __importDefault(require("./topic.model"));
const singerGroup_model_1 = __importDefault(require("./singerGroup.model"));
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
    singers: {
        type: [Schema.Types.ObjectId],
        ref: singer_model_1.default,
        required: false,
    },
    singerGroups: {
        type: [Schema.Types.ObjectId],
        ref: singerGroup_model_1.default,
        required: false,
    },
};
const SongSchema = new Schema(objSchema, { timestamps: true });
SongSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("title"))
            return;
        const Song = this.constructor;
        const baseSlug = (0, slugify_1.default)(this.title, { lower: true, strict: true });
        let slug = baseSlug;
        let count = 1;
        while (yield Song.findOne({ slug })) {
            slug = `${baseSlug}-${count}`;
            count++;
        }
        this.slug = slug;
    });
});
const SongModel = mongoose_1.default.model("Song", SongSchema, "Song");
exports.default = SongModel;
