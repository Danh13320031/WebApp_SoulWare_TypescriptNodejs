import bcrypt from "bcrypt";
import { APP_SALT_ROUND } from "../constants/app.constant";

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(APP_SALT_ROUND);
  const hash = await bcrypt.hash(password, salt);

  return hash;
};

export default hashPassword;
