export type TDataBodyCreateUser = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  avatar: string;
  birthday?: Date | null;
  address?: string | null;
  description?: string | null;
  status: string;
  position?: number;
  subscriptionPlanId: string;
  subscriptionStartAt?: Date | null;
  subscriptionEndAt?: Date | null;
};

export type TDataBodyUpdateUser = {
  email: string;
  password?: string;
  phone: string;
  avatar: string;
  fullName: string;
  birthday?: Date | null;
  address?: string | null;
  description?: string | null;
  status: string;
  position: number;
  subscriptionPlanId: string;
  subscriptionStartAt?: Date | null;
  subscriptionEndAt?: Date | null;
};
