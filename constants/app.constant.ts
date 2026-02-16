import "dotenv/config";

export const APP_HOST: string = process.env.APP_HOST as string;
export const APP_PORT: number = Number(process.env.APP_PORT);
export const APP_TIMEZONE: string = "Asia/Ho_Chi_Minh";
export const APP_PREFIX_ADMIN: string = "/admin";
