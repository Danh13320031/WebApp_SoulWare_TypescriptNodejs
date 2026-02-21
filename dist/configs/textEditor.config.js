"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_path_1 = __importDefault(require("node:path"));
const textEditorConfig = (app) => {
    app.use("/tinymce", express_1.default.static(node_path_1.default.join(__dirname, "..", "node_modules", "tinymce")));
};
exports.default = textEditorConfig;
