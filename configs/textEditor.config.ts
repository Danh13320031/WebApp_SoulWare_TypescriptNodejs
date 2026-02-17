import express, { Express } from "express";
import path from "node:path";

const textEditorConfig = (app: Express): void => {
  app.use(
    "/tinymce",
    express.static(path.join(__dirname, "..", "node_modules", "tinymce")),
  );
};

export default textEditorConfig;
