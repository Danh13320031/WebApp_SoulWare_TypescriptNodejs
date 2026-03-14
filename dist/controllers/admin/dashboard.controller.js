"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = void 0;
const activeSider_helper_1 = __importDefault(require("../../helpers/admin/activeSider.helper"));
// [GET]: /admin/dashboard
const dashboardGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pathname = (0, activeSider_helper_1.default)(req.originalUrl);
    res.render("admin/pages/dashboard/dashboard.view.ejs", {
        pageTitle: "Trang tổng quan",
        pathname,
    });
});
exports.dashboardController = {
    dashboardGet,
};
exports.default = exports.dashboardController;
