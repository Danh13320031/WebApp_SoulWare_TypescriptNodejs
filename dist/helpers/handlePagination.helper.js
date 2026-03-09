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
Object.defineProperty(exports, "__esModule", { value: true });
const handlePagination = (page, limit, type, count) => __awaiter(void 0, void 0, void 0, function* () {
    const currentPage = page ? page : 1;
    const limitPage = limit ? limit : 10;
    const skipPage = (currentPage - 1) * limitPage;
    let totalItem = count;
    const totalPage = Math.ceil(totalItem / limitPage);
    const pagination = {
        currentPage,
        limitPage,
        skipPage,
        totalItem,
        totalPage,
        type,
    };
    return pagination;
});
exports.default = handlePagination;
