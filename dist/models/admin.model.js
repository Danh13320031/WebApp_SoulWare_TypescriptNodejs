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
const adminRole_model_1 = __importDefault(require("./adminRole.model"));
const Schema = mongoose_1.default.Schema;
const objSchema = {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    slug: { type: String, index: true, unique: true },
    avatar: { type: String, required: true },
    fullName: { type: String, required: true },
    refreshToken: { type: String, required: false },
    birthday: { type: Date },
    address: { type: String },
    description: { type: String },
    status: {
        type: String,
        required: true,
        enum: ["active", "inactive"],
        default: "active",
    },
    position: { type: Number, required: true, default: 1 },
    deleted: { type: Boolean, required: true, default: false },
    deletedAt: { type: Date, default: null },
    roleId: { type: Schema.Types.ObjectId, ref: adminRole_model_1.default, required: true },
};
const AdminSchema = new Schema(objSchema, { timestamps: true });
AdminSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("fullName"))
            return;
        const Song = this.constructor;
        const baseSlug = (0, slugify_1.default)(this.fullName, { lower: true, strict: true });
        let slug = baseSlug;
        let count = 1;
        while (yield Song.findOne({ slug })) {
            slug = `${baseSlug}-${count}`;
            count++;
        }
        this.slug = slug;
    });
});
const AdminModel = mongoose_1.default.model("Admin", AdminSchema, "Admin");
exports.default = AdminModel;
