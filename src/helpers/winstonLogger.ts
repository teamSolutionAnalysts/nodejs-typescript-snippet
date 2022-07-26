import { Constants } from '../config/constants';
require('dotenv').config();

const path = require('path');
const fs = require('fs');
const logDir = process.env.WINSTON_LOGGER_FILE_PATH || process.env.HOME; // default home directory
console.log('logDir', process.env);
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const timezoned = () => {
  return new Date().toLocaleString('en-CA', {
      timeZone: process.env.WINSTON_LOGGER_TIMEZONE || 'Asia/Kolkata',
      hour12: false,
  });
}

export class WinstonLog {
  public static createMSLogger (module, methodName, className, req, responseCode: number = null, response: any = null, extra: any = null) {
    // eslint-disable-next-line no-mixed-operators
    const clientIp = req && req?.ip?.split(':').pop() || req && req.socket?.remoteAddress?.split(':').pop() || req && req.headers && req.headers['x-forwarded-for'] || null;
    const myFormat = printf(({ level, message, username, timestamp, className, threadName, clientIp, methodName }) => {
      return `[${timezoned()}] [${level.toUpperCase()}] ['${threadName}'] ['${className}'] ['${clientIp}'] [${req.globalRequestId || 'global-unique-request-id'}] [${req.msRequestId || 'ms-specific-unique-id'}] ['${username}'] ['${methodName}'] [${message}]`;
    });

    if (!fs.existsSync(logDir)) {
      // Create the directory if it does not exist
      fs.mkdirSync(logDir, { recursive: true });
    }
    const logger = createLogger({
      format: combine(
        timestamp(),
        myFormat
      ),
      transports: [
        new transports.File({ filename: path.join(logDir, '/configurator.logger.log') })
      ]
    });
    const copyBodyObject = { ...req?.body };
    const passwordAsterisk = copyBodyObject?.password;
    if (passwordAsterisk) {
      copyBodyObject['password'] = Constants.ASTERISK;
    }

    const copyExtraBodyObject = { ...extra };
    const dataPasswordAsterisk = copyExtraBodyObject?.data?.password;
    if (dataPasswordAsterisk) {
      copyExtraBodyObject.data['password'] = Constants.ASTERISK;
    }

    const headersPasswordAsterisk = copyExtraBodyObject?.headers?.password;
    if (headersPasswordAsterisk) {
      copyExtraBodyObject.headers['password'] = Constants.ASTERISK;
    }

    if (responseCode) {
      logger.log({
        level: Constants.logLevels[responseCode.toString().slice(0, 1)] || 'info',
        threadName: module,
        className,
        clientIp,
        // eslint-disable-next-line no-mixed-operators
        username: req.body?.userId || req.body?.username || '',
        methodName,
        message: `Response body string: ${JSON.stringify(response)}`
      });
    } else {
      logger.log({
        level: 'info',
        threadName: module,
        className,
        clientIp,
        // eslint-disable-next-line no-mixed-operators
        username: req.body && (req?.body?.userId || req?.body?.username) || "",
        methodName,
        message: `Request body string: ${Object.entries(copyExtraBodyObject).length !== 0
          ? JSON.stringify(copyExtraBodyObject)
          : (JSON.stringify(Object.entries(req?.query).length !== 0 ? req.query : copyBodyObject))}`,
      });
    }
  }
}
