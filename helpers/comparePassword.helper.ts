import bcrypt from "bcrypt";

const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, hash);

  return isMatch;
};

export default comparePassword;
