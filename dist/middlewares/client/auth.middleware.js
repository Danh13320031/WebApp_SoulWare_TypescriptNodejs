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
const auth_constant_1 = require("../../constants/auth.constant");
const generateAccessToken_helper_1 = __importDefault(require("../../helpers/generateAccessToken.helper"));
const verifyToken_helper_1 = __importDefault(require("../../helpers/verifyToken.helper"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const optionalAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.cookies["accessTokenUser"];
    const refreshToken = req.cookies["refreshTokenUser"];
    if (!accessToken && !refreshToken) {
        res.locals.userAccount = null;
        return next();
    }
    try {
        if (accessToken) {
            const decoded = (0, verifyToken_helper_1.default)(accessToken, auth_constant_1.AUTH_ACCESS_TOKEN_SECRET_CLIENT);
            const user = yield user_model_1.default.findOne({
                _id: decoded.id,
                deleted: false,
            })
                .select("-deleted -deletedAt -createdAt -updatedAt -slug -refreshToken -__v")
                .populate("subscriptionPlanId", "permissions");
            res.locals.userAccount = user || null;
            return next();
        }
    }
    catch (err) {
        if (err.name !== "TokenExpiredError") {
            res.locals.userAccount = null;
            return next();
        }
    }
    if (!refreshToken) {
        res.locals.userAccount = null;
        return next();
    }
    try {
        const decodedRefresh = (0, verifyToken_helper_1.default)(refreshToken, auth_constant_1.AUTH_REFRESH_TOKEN_SECRET_CLIENT);
        const user = yield user_model_1.default.findOne({
            _id: decodedRefresh.id,
            refreshToken: refreshToken,
            deleted: false,
        })
            .select("-deleted -deletedAt -createdAt -updatedAt -slug -accessToken -__v")
            .populate("subscriptionPlanId", "permissions");
        if (!user) {
            res.locals.userAccount = null;
            return next();
        }
        const dataAccessTokenPayload = {
            id: user._id.toString(),
            email: user.email,
            subscriptionPlanId: user.subscriptionPlanId.toString(),
        };
        const newAccessToken = yield (0, generateAccessToken_helper_1.default)(dataAccessTokenPayload, auth_constant_1.AUTH_ACCESS_TOKEN_SECRET_CLIENT, auth_constant_1.AUTH_ACCESS_TOKEN_EXPIRES_IN_CLIENT);
        res.cookie("accessTokenUser", newAccessToken, Object.assign(Object.assign({}, auth_constant_1.AUTH_COOKIE_OPTIONS), { maxAge: auth_constant_1.AUTH_ACCESS_TOKEN_COOKIE_MAX_AGE_CLIENT }));
        res.locals.userAccount = user;
        return next();
    }
    catch (error) {
        res.locals.userAccount = null;
        return next();
    }
});
const requiredAuth = (req, res, next) => {
    if (!res.locals.userAccount) {
        return res.redirect("/auth/register");
    }
    next();
};
const authMiddleware = { optionalAuth, requiredAuth };
exports.default = authMiddleware;
