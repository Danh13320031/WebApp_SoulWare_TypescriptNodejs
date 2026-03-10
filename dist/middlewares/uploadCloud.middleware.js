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
const uploadCloud_config_1 = __importDefault(require("../configs/uploadCloud.config"));
const uploadToCloudinary_helper_1 = __importDefault(require("../helpers/uploadToCloudinary.helper"));
(0, uploadCloud_config_1.default)();
const uploadSingerField = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        if (!file) {
            next();
            return;
        }
        const result = yield (0, uploadToCloudinary_helper_1.default)(file.buffer);
        req.body[file.fieldname] = result;
    }
    catch (error) {
        console.log("Upload singer field error::: ", error);
    }
    next();
    return;
});
const uploadDiffMultiField = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const fileObj = req.files;
    for (const key in fileObj) {
        req.body[key] = [];
        const fileList = fileObj[key];
        for (const file of fileList) {
            try {
                const result = yield (0, uploadToCloudinary_helper_1.default)(file.buffer);
                req.body[key].push(result);
            }
            catch (error) {
                console.log("Upload diff multi file error::: ", error);
            }
        }
    }
    next();
    return;
});
const uploadCloud = { uploadSingerField, uploadDiffMultiField };
exports.default = uploadCloud;
