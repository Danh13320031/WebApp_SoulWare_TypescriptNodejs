"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const app_constant_1 = require("../constants/app.constant");
const timeConfig = (app) => {
    dayjs_1.default.extend(utc_1.default);
    dayjs_1.default.extend(timezone_1.default);
    dayjs_1.default.tz.setDefault(app_constant_1.APP_TIMEZONE);
    app.locals.dayjs = dayjs_1.default;
};
exports.default = timeConfig;
