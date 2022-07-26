/* eslint-disable no-useless-catch */
import _ = require('lodash');
import { Op } from 'sequelize';
import { Connection } from '../../connection';
import { Hazelcast } from '../../helpers/hazelcast';
import { Log } from '../../helpers/logger';
import { ResponseBuilder } from '../../helpers/responseBuilder';
import Configuration from '../../models/configuration';

const { sequelize } = Connection.get();

export class ConfigurationUtils {
  public hazelcastUtils: Hazelcast = new Hazelcast();
  private readonly logger: any = Log.getLogger();

  public async getConfigurations (fields: any, fromDB: any): Promise<ResponseBuilder> {
    try {
      let result: any;

      let hazelcastData = await this.hazelcastUtils.getQueryData(fields || '');
      if (fromDB) {
        hazelcastData = null;
      }
      if (hazelcastData && hazelcastData.length > 0) {
        result = hazelcastData;
      } else {
        let getConfig: any;
        if (fields) {
          getConfig = {
            attributes: ['configurableKey', 'configurableValue', 'configDatatype', 'configurableUnit'],
            where: {
              configurableKey: {
                [Op.startsWith]: fields || null
              }
            }
          }
        } else {
          getConfig = {
            attributes: ['configurableKey', 'configurableValue', 'configDatatype', 'configurableUnit']
          }
        }
        result = await Configuration.findAll(getConfig);
        const array = [];
        for (const data of result) {
          array.push(data.dataValues);
        }
        result = array;
      }

      result = await this.setConfigurationData(result);
      return ResponseBuilder.data(result);
    } catch (error) {
      throw ResponseBuilder.error(error);
    }
  }

  public async setConfigurationData (result: any) {
    if (result.length > 0) {
      result.forEach((element) => {
        if (element?.configDatatype === 'JSON') {
          element.configurableValue = JSON.parse(element.configurableValue);
        }
        if (element.configurableUnit) {
          element.configurableValue = `${element.configurableValue} ${element.configurableUnit}`;
        }
        delete element.configurableUnit;
        delete element.configDatatype;
      });
    }
    return result;
  }

  public async setConfigurations (fields: any): Promise<ResponseBuilder> {
    const t = await sequelize.transaction();
    try {
      for (const key in fields) {
        if (fields[key]) {
          let value = fields[key];
          if (_.isObject(value) || _.isArray(value)) {
            value = JSON.stringify(value);
          }
          await Configuration.update({ configurableValue: value }, {
            where: {
              configurableKey: key
            },
            returning: true,
            plain: true
          });
        }
      }
      await t.commit();
      await this.hazelcastUtils.updateAllData(fields);
      // Note : Update into hCast....
      return ResponseBuilder.data({ success: true });
    } catch (error) {
      const err = (error.errors && error.errors[0].message) || error.parent?.sqlMessage || error;
      await t.rollback();
      this.logger.error(err);
      // throw error;
      throw ResponseBuilder.error(error);
    }
  }

  public async syncHazelcast () {
    try {
      let result;
      result = await Configuration.findAll(
        {
          attributes: ['configurableKey', 'configurableValue', 'configDatatype', 'configurableUnit'],
          where: {
            configurableValue: {
              [Op.ne]: null
            }
          }
        }
      );

      if (result.length > 0) {
        const array = [];
        for (const data of result) {
          array.push(data.dataValues);
        }
        result = array;
      }

      await this.hazelcastUtils.setAllData(result);
    } catch (error) {
      throw error;
    }
  }
}
