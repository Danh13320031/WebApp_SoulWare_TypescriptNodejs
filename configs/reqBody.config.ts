import bodyParser from "body-parser";
import { Express } from "express";

const reqBodyConfig = (app: Express): void => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
};

export default reqBodyConfig;
