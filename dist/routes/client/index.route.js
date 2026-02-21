"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const favoriteSong_route_1 = __importDefault(require("./favoriteSong.route"));
const search_route_1 = __importDefault(require("./search.route"));
const song_route_1 = __importDefault(require("./song.route"));
const topic_route_1 = __importDefault(require("./topic.route"));
const createClientRoute = (app) => {
    app.use("/topics", topic_route_1.default);
    app.use("/songs", song_route_1.default);
    app.use("/favorite-songs", favoriteSong_route_1.default);
    app.use("/search", search_route_1.default);
    return;
};
exports.default = createClientRoute;
