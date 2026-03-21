"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateRefreshToken = (payload, secret, expiresIn) => {
    const refreshTokenStr = jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn: expiresIn,
    });
    return refreshTokenStr;
};
exports.default = generateRefreshToken;
