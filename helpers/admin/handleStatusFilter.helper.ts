import { TStatusFilter } from "../../types/index.type";

interface IStatusFilter {
  value: string;
  label: string;
  class: string;
}

const handleStatusFilter = (status: string): IStatusFilter => {
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

  const statusFilter: TStatusFilter =
    statusList.find((item) => item.value === status) || statusList[0];

  return statusFilter;
};

export default handleStatusFilter;
