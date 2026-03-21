export type TDataAccessTokenPayload = {
  id: string;
  email: string;
  roleId: string;
};

export type TDataRefreshTokenPayload = {
  id: string;
};

export type TAuthCookieOptions = {
  httpOnly: boolean;
  secure?: boolean;
  sameSite: "strict" | "lax" | "none";
  maxAge?: number;
};
