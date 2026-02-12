import { Express } from "express";
import songRoute from "./song.route";
import topicRoute from "./topic.route";
import favoriteSongRoute from "./favoriteSong.route";

const createClientRoute = (app: Express): void => {
  app.use("/topics", topicRoute);
  app.use("/songs", songRoute);
  app.use("/favorite-songs", favoriteSongRoute);
};

export default createClientRoute;
