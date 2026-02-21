"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const streamifier_1 = __importDefault(require("streamifier"));
const createUploadStream = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.v2.uploader.upload_stream({
            resource_type: "auto",
        }, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
        streamifier_1.default.createReadStream(buffer).pipe(stream);
    });
};
exports.default = createUploadStream;
