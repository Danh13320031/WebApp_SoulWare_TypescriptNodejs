"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_constant_1 = require("../../constants/app.constant");
const admin_routes_1 = __importDefault(require("./admin.routes"));
const adminRole_route_1 = __importDefault(require("./adminRole.route"));
const dashboard_route_1 = __importDefault(require("./dashboard.route"));
const song_route_1 = __importDefault(require("./song.route"));
const topic_route_1 = __importDefault(require("./topic.route"));
const upload_route_1 = __importDefault(require("./upload.route"));
const createAdminRoute = (app) => {
    const pathAdmin = app_constant_1.APP_PREFIX_ADMIN;
    app.use(`${pathAdmin}/dashboard`, dashboard_route_1.default);
    app.use(`${pathAdmin}/topics`, topic_route_1.default);
    app.use(`${pathAdmin}/songs`, song_route_1.default);
    app.use(`${pathAdmin}/upload`, upload_route_1.default);
    app.use(`${pathAdmin}/admins`, admin_routes_1.default);
    app.use(`${pathAdmin}/admin-roles`, adminRole_route_1.default);
    return;
};
exports.default = createAdminRoute;
