import express, { Express } from "express";
import connectDbConfig from "./configs/database.config";
import setPrefixAdminPathConfig from "./configs/prefixAdminPath.config";
import reqBodyConfig from "./configs/reqBody.config";
import reqCookieConfig from "./configs/reqCookie.config";
import setStaticFileConfig from "./configs/staticFile.config";
import timeConfig from "./configs/systemTime.config";
import textEditorConfig from "./configs/textEditor.config";
import setViewEngineConfig from "./configs/viewEngine.config";
import { APP_HOST, APP_PORT } from "./constants/app.constant";
import createAdminRoute from "./routes/admin/index.route";
import createClientRoute from "./routes/client/index.route";

// Connect to MongoDB
connectDbConfig();

const app: Express = express();
const host: string = APP_HOST;
const port: number = APP_PORT;

// Config req body
reqBodyConfig(app);

// Config req cookie
reqCookieConfig(app);

// Config system time
timeConfig(app);

// Config static file
setStaticFileConfig(app);

// Config EJS package
setViewEngineConfig(app);

// Config prefix admin path
setPrefixAdminPathConfig(app);

// Text formatter config
textEditorConfig(app);

// Admin routes
createAdminRoute(app);

// Client routes
createClientRoute(app);

app.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`);
});
