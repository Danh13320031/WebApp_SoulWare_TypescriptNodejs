import { Express } from "express";
import topicRoute from "./topic.route";

const createClientRoute = (app: Express): void => {
  app.use("/topics", topicRoute);
};

export default createClientRoute;
