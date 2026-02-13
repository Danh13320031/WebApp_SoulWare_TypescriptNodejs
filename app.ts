import express, { Express } from "express";
import connectDbConfig from "./configs/database.config";
import setStaticFileConfig from "./configs/staticFile.config";
import setViewEngineConfig from "./configs/viewEngine.config";
import { APP_HOST, APP_PORT } from "./constants/constant";
import createClientRoute from "./routes/client/index.route";
import timeConfig from "./configs/systemTime.config";

// Connect to MongoDB
connectDbConfig();

const app: Express = express();
const host: string = APP_HOST;
const port: number = APP_PORT;

// Config system time
timeConfig(app);

// Config static file
setStaticFileConfig(app);

// Config EJS package
setViewEngineConfig(app);

// Client routes
createClientRoute(app);

app.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`);
});
