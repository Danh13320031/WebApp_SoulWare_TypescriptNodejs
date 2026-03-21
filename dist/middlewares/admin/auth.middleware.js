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
const admin_model_1 = __importDefault(require("../../models/admin.model"));
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.cookies["accessTokenAdmin"];
    const refreshToken = req.cookies["refreshTokenAdmin"];
    if (!accessToken && !refreshToken)
        return res.redirect("/admin/auth/login");
    try {
        if (accessToken) {
            const decoded = (0, verifyToken_helper_1.default)(accessToken, auth_constant_1.AUTH_ACCESS_TOKEN_SECRET_ADMIN);
            const admin = yield admin_model_1.default.findOne({
                _id: decoded.id,
                deleted: false,
            })
                .select("-deleted -deletedAt -createdAt -updatedAt -slug -refreshToken -__v")
                .populate("roleId", "permissions");
            if (!admin)
                throw new Error("Admin not found");
            res.locals.adminAccount = admin;
            return next();
        }
    }
    catch (err) {
        if (err.name !== "TokenExpiredError") {
            res.clearCookie("accessTokenAdmin");
            res.clearCookie("refreshTokenAdmin");
            return res.redirect("/admin/auth/login");
        }
    }
    if (!refreshToken)
        return res.redirect("/admin/auth/login");
    try {
        const decodedRefresh = (0, verifyToken_helper_1.default)(refreshToken, auth_constant_1.AUTH_REFRESH_TOKEN_SECRET_ADMIN);
        const admin = yield admin_model_1.default.findOne({
            _id: decodedRefresh.id,
            refreshToken: refreshToken,
            deleted: false,
        })
            .select("-deleted -deletedAt -createdAt -updatedAt -slug -accessToken -__v")
            .populate("roleId", "permissions");
        if (!admin)
            return res.redirect("/admin/auth/login");
        const dataAccessTokenPayload = {
            id: admin._id.toString(),
            email: admin.email,
            roleId: admin.roleId.toString(),
        };
        const newAccessToken = yield (0, generateAccessToken_helper_1.default)(dataAccessTokenPayload, auth_constant_1.AUTH_ACCESS_TOKEN_SECRET_ADMIN, auth_constant_1.AUTH_ACCESS_TOKEN_EXPIRES_IN_ADMIN);
        res.cookie("accessTokenAdmin", newAccessToken, Object.assign(Object.assign({}, auth_constant_1.AUTH_COOKIE_OPTIONS), { maxAge: auth_constant_1.AUTH_ACCESS_TOKEN_COOKIE_MAX_AGE_ADMIN }));
        res.locals.adminAccount = admin;
        return next();
    }
    catch (error) {
        res.clearCookie("accessTokenAdmin");
        res.clearCookie("refreshTokenAdmin");
        return res.redirect("/admin/auth/login");
    }
});
const authMiddleware = { auth };
exports.default = authMiddleware;
