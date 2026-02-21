"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ejs_1 = __importDefault(require("ejs"));
const setViewEngineConfig = (app) => {
    app.set("views", "./views");
    app.set("view engine", "ejs");
    ejs_1.default.delimiter = "%";
    ejs_1.default.openDelimiter = "<";
    ejs_1.default.closeDelimiter = ">";
};
exports.default = setViewEngineConfig;
