export type TPagination = {
  currentPage: number;
  limitPage: number;
  skipPage: number;
  totalItem: number;
  totalPage: number;
  type?: string;
};

export type TStatusFilter = {
  value: string;
  label: string;
  class: string;
};
