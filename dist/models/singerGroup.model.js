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
const Schema = mongoose_1.default.Schema;
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
    singers: { type: [Schema.Types.ObjectId], ref: singer_model_1.default, required: true },
};
const SingerGroupSchema = new Schema(objSchema, { timestamps: true });
SingerGroupSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("name"))
            return;
        const SingerGroup = this.constructor;
        let slug = (0, slugify_1.default)(this.name, { lower: true, strict: true });
        let newSlug = slug;
        let count = 1;
        while (yield SingerGroup.findOne({ slug })) {
            slug = `${newSlug}-${count}`;
            count++;
        }
        this.slug = slug;
    });
});
const SingerGroupModel = mongoose_1.default.model("SingerGroup", SingerGroupSchema, "SingerGroup");
exports.default = SingerGroupModel;
