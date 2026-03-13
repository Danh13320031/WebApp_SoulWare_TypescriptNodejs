import "dotenv/config";

export const WHITESPACE_TO_HYPHEN_REGEX: RegExp = /\s+/g;
export const EMAIL_REGEX: RegExp =
  /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/;
export const STRONG_PASSWORD_REGEX: RegExp =
  /(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/;
export const VN_PHONE_REGEX: RegExp = /^(03|05|07|08|09)[0-9]{8}$/;
