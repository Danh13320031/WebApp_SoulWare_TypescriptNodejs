import express, { Express } from "express";
import viewEngineConfig from "./configs/viewEngine.config";

const app: Express = express();
const port: number = 3000;

// Config EJS package
viewEngineConfig(app);

app.get("/", (req, res) => {
  res.render("client/pages/topic/topic.view.ejs");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
