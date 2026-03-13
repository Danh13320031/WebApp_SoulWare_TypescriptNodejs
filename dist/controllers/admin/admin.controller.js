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
exports.adminController = void 0;
const http_status_codes_1 = require("http-status-codes");
const admin_model_1 = __importDefault(require("../../models/admin.model"));
const hashPassword_helper_1 = __importDefault(require("../../helpers/hashPassword.helper"));
// [GET]: /admin/admin
const adminGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("admin/pages/admin/admin.view.ejs", {
        pageTitle: "Danh sách quản trị viên",
    });
});
// [GET]: /admin/admins/create
const createANewAdminGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.render("admin/pages/admin/create.view.ejs", {
            pageTitle: "Tạo mới quản trị viên",
        });
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - create new admin",
        });
        return;
    }
});
// [POST]: /admin/admins/create
const createANewAdminPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const countDocument = yield admin_model_1.default.countDocuments();
        let avatar = "";
        let password = "";
        let fullName = "";
        if (req.body.avatar)
            avatar = req.body.avatar;
        if (req.body.password)
            password = yield (0, hashPassword_helper_1.default)(req.body.password);
        if (req.body.name)
            fullName = req.body.name;
        const dataBodyCreateAdmin = {
            email: req.body.email ? req.body.email : "",
            password: password ? password : "",
            phone: req.body.phone ? req.body.phone : "",
            avatar: avatar ? avatar : "",
            fullName: fullName ? fullName : "",
            birthday: req.body.birthday ? req.body.birthday : null,
            address: req.body.address ? req.body.address : null,
            description: req.body.description ? req.body.description : null,
            status: req.body.status ? req.body.status : "active",
            position: req.body.position
                ? Number(req.body.position)
                : countDocument + 1,
        };
        const newAdmin = new admin_model_1.default(dataBodyCreateAdmin);
        yield newAdmin.save();
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            code: http_status_codes_1.StatusCodes.CREATED,
            status: "Success",
            message: "Tạo mới quản trị viên thành công!",
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - create new admin",
        });
        return;
    }
});
exports.adminController = {
    adminGet,
    createANewAdminGet,
    createANewAdminPost,
};
exports.default = exports.adminController;
