import { Request, Response } from 'express';
import { Constants } from '../../config/constants';
import { ResponseBuilder } from '../../helpers/responseBuilder';
import { WinstonLog } from '../../helpers/winstonLogger';
import { ConfigurationUtils } from './configurationUtils';

export class ConfigurationController {
  private readonly configurationUtils: ConfigurationUtils = new ConfigurationUtils();

  public getConfigurations = async (req: Request, res: Response) => {
    const { fields, fromDB } = req.query;
    WinstonLog.createMSLogger(Constants.ELK_LOGGER_MODULE, 'getConfigurations', 'ConfigurationController', req);
    const result: ResponseBuilder = await this.configurationUtils.getConfigurations(fields, fromDB);
    WinstonLog.createMSLogger(Constants.ELK_LOGGER_MODULE, 'getConfigurations', 'ConfigurationController', req, Constants.SUCCESS_CODE, result);
    return res.status(result.responseCode).json({ responseCode: Constants.SUCCESS_CODE, responseMessage: req.__('CONFIGURATION_GET_SUCCESSFULLY'), result: result.result });
  }

  public setConfigurations = async (req: Request, res: Response) => {
    const configKeys = req.body;
    WinstonLog.createMSLogger(Constants.ELK_LOGGER_MODULE, 'setConfigurations', 'ConfigurationController', req);
    const result: ResponseBuilder = await this.configurationUtils.setConfigurations(configKeys);
    WinstonLog.createMSLogger(Constants.ELK_LOGGER_MODULE, 'setConfigurations', 'ConfigurationController', req, Constants.SUCCESS_CODE, result);
    return res.status(result.responseCode).json({ responseCode: Constants.SUCCESS_CODE, responseMessage: req.__('CONFIGURATION_SET_SUCCESSFULLY'), result: result.result });
  }

  public syncHazelcast = async (req: Request, res: Response) => {
    WinstonLog.createMSLogger(Constants.ELK_LOGGER_MODULE, 'syncHazelcast', 'ConfigurationController', req);
    await this.configurationUtils.syncHazelcast();
    WinstonLog.createMSLogger(Constants.ELK_LOGGER_MODULE, 'syncHazelcast', 'ConfigurationController', req, Constants.SUCCESS_CODE);
    return res.status(Constants.SUCCESS_CODE).json({ responseCode: Constants.SUCCESS_CODE, responseMessage: req.__('CONFIGURATION_SYNC_SUCCESSFULLY') });
  }
}
