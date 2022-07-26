import { createLogger, format, transports } from 'winston';
import { Constants } from '../config/constants';
import { Dates } from './date';

const {
  combine, timestamp, prettyPrint, colorize
} = format;

export class Log {
  public static getLogger () {
    return createLogger({
      format: combine(
        timestamp({ format: this.timestampFormat }),
        prettyPrint(),
        colorize()
      ),
      // level: process.env.LOG_LEVEL,
      transports: [new transports.Console()],
    });
  }

  private static readonly timestampFormat: any = new Dates().getMomentDate(null, {
    timezone: Constants.TIMEZONE,
    format: Constants.DATE_TIME_FORMAT
  });
}
