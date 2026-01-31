import express, { Express } from "express";

export const setStaticFileConfig = (app: Express): void => {
  app.use(express.static("public"));
};

export default setStaticFileConfig;
