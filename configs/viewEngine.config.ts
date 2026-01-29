import ejs from "ejs";
import { Express } from "express";

const viewEngineConfig = (app: Express) => {
  app.set("views", "./views");
  app.set("view engine", "ejs");

  ejs.delimiter = "%";
  ejs.openDelimiter = "<";
  ejs.closeDelimiter = ">";
};

export default viewEngineConfig;
