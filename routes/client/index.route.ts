import { Express } from "express";
import authRoute from "./auth.route";
import favoriteSongRoute from "./favoriteSong.route";
import searchRoute from "./search.route";
import songRoute from "./song.route";
import topicRoute from "./topic.route";

const createClientRoute = (app: Express): void => {
  app.use("/topics", topicRoute);
  app.use("/songs", songRoute);
  app.use("/favorite-songs", favoriteSongRoute);
  app.use("/search", searchRoute);
  app.use("/auth", authRoute);

  return;
};

export default createClientRoute;
