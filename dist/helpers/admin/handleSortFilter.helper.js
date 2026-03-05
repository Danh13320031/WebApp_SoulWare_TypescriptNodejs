"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleSortFilter = (sort) => {
    let sortOptions = {};
    if (!sort) {
        sort = "position-desc";
        sortOptions = {
            position: "desc",
        };
    }
    else {
        const sortArr = sort.split("-");
        const sortValue = sortArr[0];
        const sortType = sortArr[1];
        sortOptions = {
            [sortValue]: sortType,
        };
    }
    const sortFilter = {
        sortOptions: sortOptions,
        sort: sort,
    };
    return sortFilter;
};
exports.default = handleSortFilter;
