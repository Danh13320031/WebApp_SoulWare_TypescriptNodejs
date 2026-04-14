export type TDataAccessTokenPayload = {
  id: string;
  email: string;
  roleId: string;
};

export type TDataRefreshTokenPayload = {
  id: string;
};

export type TDataRegister = {
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  fullName: string;
};

export type TAuthCookieOptions = {
  httpOnly: boolean;
  secure?: boolean;
  sameSite: "strict" | "lax" | "none";
  maxAge?: number;
};
