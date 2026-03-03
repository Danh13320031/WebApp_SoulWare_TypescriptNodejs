import { TStatusFilter } from "../../types/index.type";

interface IStatusFilter {
  value: string;
  label: string;
  class: string;
}

const handleStatusFilter = (status: string): IStatusFilter[] => {
  const statusList: TStatusFilter[] = [
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
    if (item.value === status) item.class = "active";
  }

  return statusList;
};

export default handleStatusFilter;
