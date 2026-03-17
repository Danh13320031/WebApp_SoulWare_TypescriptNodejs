export type TDataBodyCreateAdmin = {
  email: string;
  password: string;
  phone: string;
  avatar: string;
  fullName: string;
  birthday?: Date;
  address?: string;
  description?: string;
  status: string;
  position?: number;
  roleId: string;
};

export type TDataBodyUpdateAdmin = {
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
