"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleStatusFilter = (status) => {
    const statusList = [
        {
            value: "all",
            label: "Tất cả",
            class: "active",
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
    const statusFilter = statusList.find((item) => item.value === status) || statusList[0];
    return statusFilter;
};
exports.default = handleStatusFilter;
