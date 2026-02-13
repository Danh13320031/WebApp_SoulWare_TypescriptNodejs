import "dotenv/config";

// App
export const APP_HOST: string = process.env.APP_HOST as string;
export const APP_PORT: number = Number(process.env.APP_PORT);
export const APP_TIMEZONE: string = "Asia/Ho_Chi_Minh";

// Database
export const DATABASE_URL: string = process.env.DATABASE_URL as string;

// Regular Expression
export const WHITESPACE_TO_HYPHEN: RegExp = /\s+/g;
