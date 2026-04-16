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
const http_status_codes_1 = require("http-status-codes");
const activeSider_helper_1 = __importDefault(require("../../helpers/admin/activeSider.helper"));
const subscriptionPlan_model_1 = __importDefault(require("../../models/subscriptionPlan.model"));
const getAllSubscriptionPlanGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pathname = (0, activeSider_helper_1.default)(req.originalUrl);
        let find = { deleted: false };
        const subscriptionPlanList = yield subscriptionPlan_model_1.default.find(find);
        res.render("admin/pages/subscriptionPlan/subscriptionPlan.view.ejs", {
            pageTitle: "Danh sách gói dịch vụ",
            pathname,
            subscriptionPlanList,
        });
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - get all subscription plans",
        });
    }
});
const subscriptionPlanController = {
    getAllSubscriptionPlanGet,
};
exports.default = subscriptionPlanController;
