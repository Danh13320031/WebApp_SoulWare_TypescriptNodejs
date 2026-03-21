"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_config_1 = __importDefault(require("./configs/database.config"));
const prefixAdminPath_config_1 = __importDefault(require("./configs/prefixAdminPath.config"));
const reqBody_config_1 = __importDefault(require("./configs/reqBody.config"));
const reqCookie_config_1 = __importDefault(require("./configs/reqCookie.config"));
const staticFile_config_1 = __importDefault(require("./configs/staticFile.config"));
const systemTime_config_1 = __importDefault(require("./configs/systemTime.config"));
const textEditor_config_1 = __importDefault(require("./configs/textEditor.config"));
const viewEngine_config_1 = __importDefault(require("./configs/viewEngine.config"));
const app_constant_1 = require("./constants/app.constant");
const index_route_1 = __importDefault(require("./routes/admin/index.route"));
const index_route_2 = __importDefault(require("./routes/client/index.route"));
// Connect to MongoDB
(0, database_config_1.default)();
const app = (0, express_1.default)();
const host = app_constant_1.APP_HOST;
const port = app_constant_1.APP_PORT;
// Config req body
(0, reqBody_config_1.default)(app);
// Config req cookie
(0, reqCookie_config_1.default)(app);
// Config system time
(0, systemTime_config_1.default)(app);
// Config static file
(0, staticFile_config_1.default)(app);
// Config EJS package
(0, viewEngine_config_1.default)(app);
// Config prefix admin path
(0, prefixAdminPath_config_1.default)(app);
// Text formatter config
(0, textEditor_config_1.default)(app);
// Admin routes
(0, index_route_1.default)(app);
// Client routes
(0, index_route_2.default)(app);
app.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}`);
});
