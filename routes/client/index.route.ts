import { Express } from "express";
import songRoute from "./song.route";
import topicRoute from "./topic.route";

const createClientRoute = (app: Express): void => {
  app.use("/topics", topicRoute);
  app.use("/songs", songRoute);
};

export default createClientRoute;
