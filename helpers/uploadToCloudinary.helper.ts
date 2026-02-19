import createUploadStream from "./createUploadStream.helper";

const uploadToCloudinary = async (buffer: any): Promise<string> => {
  const result = await createUploadStream(buffer);
  return result["secure_url"];
};

export default uploadToCloudinary;
