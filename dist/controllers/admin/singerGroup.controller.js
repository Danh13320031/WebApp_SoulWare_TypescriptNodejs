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
const convertTextToSlug_helper_1 = __importDefault(require("../../helpers/convertTextToSlug.helper"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const singerGroup_model_1 = __importDefault(require("../../models/singerGroup.model"));
// [GET]: /admin/singer-groups
const singerGroupGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pathname = (0, activeSider_helper_1.default)(req.originalUrl);
        let find = { deleted: false };
        // Handle search filter
        let keyword = "";
        let keywordRegex = new RegExp("", "i");
        let slugRegex = new RegExp("", "i");
        if (req.query.keyword)
            keyword = req.query.keyword;
        if (keyword) {
            keywordRegex = new RegExp(keyword, "i");
            slugRegex = new RegExp((0, convertTextToSlug_helper_1.default)(keyword), "i");
            find = Object.assign(Object.assign({}, find), { $or: [
                    { fullName: { $regex: keywordRegex } },
                    { slug: { $regex: slugRegex } },
                ] });
        }
        const singerGroupList = yield singerGroup_model_1.default.find(find)
            .sort({
            position: "desc",
        })
            .populate("singers", "fullName stageName");
        res.render("admin/pages/singerGroup/singerGroup.view.ejs", {
            pageTitle: "Danh sách nhóm ca sĩ",
            pathname,
            singerGroupList,
            keyword,
        });
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - singerGroupGet",
        });
        return;
    }
});
// [GET]: /admin/singer-groups/create
const createANewSingerGroupGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pathname = (0, activeSider_helper_1.default)(req.originalUrl);
        let find = { deleted: false };
        const singerList = yield singer_model_1.default.find(find).select("stageName");
        res.render("admin/pages/singerGroup/create.view.ejs", {
            pageTitle: "Tạo mới nhóm ca sĩ",
            pathname,
            singerList,
        });
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - createANewSingerGroupGet",
        });
        return;
    }
});
// [POST]: /admin/singer-groups/create
const createANewSingerGroupPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const countDocument = yield singerGroup_model_1.default.countDocuments();
        let avatar = "";
        if (req.body.avatar)
            avatar = req.body.avatar;
        const dataBodyCreateSingerGroup = {
            avatar: avatar ? avatar : "",
            name: req.body.name ? req.body.name : "",
            description: req.body.description ? req.body.description : null,
            status: req.body.status ? req.body.status : "active",
            position: req.body.position
                ? Number(req.body.position)
                : countDocument + 1,
            singers: req.body.singers ? req.body.singers : [],
        };
        const newSingerGroup = new singerGroup_model_1.default(dataBodyCreateSingerGroup);
        yield newSingerGroup.save();
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            code: http_status_codes_1.StatusCodes.CREATED,
            status: "Success",
            message: "Tạo mới nhóm ca sĩ thành công!",
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            status: "Fail",
            message: "Server error - createANewSingerGroupPost",
        });
        return;
    }
});
const singerGroupController = {
    singerGroupGet,
    createANewSingerGroupGet,
    createANewSingerGroupPost,
};
exports.default = singerGroupController;
