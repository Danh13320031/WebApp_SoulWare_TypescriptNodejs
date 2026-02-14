import unidecode from "unidecode";
import { WHITESPACE_TO_HYPHEN } from "../../../constants/regex.constant";

const convertTextToSlug = (text: string): string => {
  const unidecodeText: string = unidecode(text);
  const slug: string = unidecodeText
    .trim()
    .replace(WHITESPACE_TO_HYPHEN, "-")
    .toLowerCase();

  return slug;
};

export default convertTextToSlug;
