"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VN_PHONE_REGEX = exports.STRONG_PASSWORD_REGEX = exports.EMAIL_REGEX = exports.WHITESPACE_TO_HYPHEN_REGEX = void 0;
require("dotenv/config");
exports.WHITESPACE_TO_HYPHEN_REGEX = /\s+/g;
exports.EMAIL_REGEX = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/;
exports.STRONG_PASSWORD_REGEX = /(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/;
exports.VN_PHONE_REGEX = /^(03|05|07|08|09)[0-9]{8}$/;
