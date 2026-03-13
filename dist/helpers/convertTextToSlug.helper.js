"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const unidecode_1 = __importDefault(require("unidecode"));
const regex_constant_1 = require("../constants/regex.constant");
const convertTextToSlug = (text) => {
    const unidecodeText = (0, unidecode_1.default)(text);
    const slug = unidecodeText
        .trim()
        .replace(regex_constant_1.WHITESPACE_TO_HYPHEN_REGEX, "-")
        .toLowerCase();
    return slug;
};
exports.default = convertTextToSlug;
