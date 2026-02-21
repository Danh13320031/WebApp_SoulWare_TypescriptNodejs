"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_constant_1 = require("../constants/app.constant");
const setPrefixAdminPathConfig = (app) => {
    app.locals.prefixAdminPath = app_constant_1.APP_PREFIX_ADMIN;
};
exports.default = setPrefixAdminPathConfig;
