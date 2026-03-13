import unidecode from "unidecode";
import { WHITESPACE_TO_HYPHEN_REGEX } from "../constants/regex.constant";

const convertTextToSlug = (text: string): string => {
  const unidecodeText: string = unidecode(text);
  const slug: string = unidecodeText
    .trim()
    .replace(WHITESPACE_TO_HYPHEN_REGEX, "-")
    .toLowerCase();

  return slug;
};

export default convertTextToSlug;
