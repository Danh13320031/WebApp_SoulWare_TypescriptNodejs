export type TDataBodyCreateUser = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  avatar: string;
  birthday?: Date;
  address?: string;
  description?: string;
  status: string;
  position?: number;
  roleId: string;
};

export type TDataBodyUpdateUser = {
  email: string;
  password?: string;
  phone: string;
  avatar: string;
  fullName: string;
  birthday?: Date;
  address?: string;
  description?: string;
  status: string;
  position: number;
  roleId: string;
};
