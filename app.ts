import express, { Express } from "express";
import connectDbConfig from "./configs/database.config";
import setViewEngineConfig from "./configs/viewEngine.config";
import { APP_HOST, APP_PORT } from "./constants/constant";
import createClientRoute from "./routes/client/index.route";

// Connect to MongoDB
connectDbConfig();

const app: Express = express();
const host: string = APP_HOST;
const port: number = APP_PORT;

// Config EJS package
setViewEngineConfig(app);

// Client routes
createClientRoute(app);

app.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`);
});
