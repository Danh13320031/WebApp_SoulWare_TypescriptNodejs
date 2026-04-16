"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscriptionPlan_controller_1 = __importDefault(require("../../controllers/admin/subscriptionPlan.controller"));
const auth_middleware_1 = __importDefault(require("../../middlewares/admin/auth.middleware"));
const subscriptionPlanRoute = (0, express_1.Router)();
subscriptionPlanRoute.get("/", auth_middleware_1.default.auth, subscriptionPlan_controller_1.default.getAllSubscriptionPlanGet);
exports.default = subscriptionPlanRoute;
