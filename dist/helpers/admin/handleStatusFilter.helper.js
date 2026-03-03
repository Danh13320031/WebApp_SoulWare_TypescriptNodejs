"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleStatusFilter = (status) => {
    const statusList = [
        {
            value: "all",
            label: "Tất cả",
            class: "",
        },
        {
            value: "active",
            label: "Đang hoạt động",
            class: "",
        },
        {
            value: "inactive",
            label: "Vô hiệu hóa",
            class: "",
        },
    ];
    for (const item of statusList) {
        if (item.value === status)
            item.class = "active";
    }
    return statusList;
};
exports.default = handleStatusFilter;
