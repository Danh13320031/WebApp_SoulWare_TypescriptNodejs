import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Express } from "express";
import { APP_TIMEZONE } from "../constants/app.constant";

const timeConfig = (app: Express): void => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.tz.setDefault(APP_TIMEZONE);
  app.locals.dayjs = dayjs;
};

export default timeConfig;
