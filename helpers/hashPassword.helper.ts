import bcrypt from "bcrypt";
import { AUTH_SALT_ROUND } from "../constants/auth.constant";

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(AUTH_SALT_ROUND);
  const hash = await bcrypt.hash(password, salt);

  return hash;
};

export default hashPassword;
