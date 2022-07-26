import { config } from "dotenv";
import { DATE, INTEGER, NOW, STRING } from "sequelize";
import { Tables } from "../config/tables";
import { Connection } from "../connection";

const { sequelize } = Connection.get();

config();

export class ConfigurationSchema {
    public static configuration = {
      id: {
        type: INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      configurableKey: {
        type: STRING,
        allowNull: false,
      },
      configurableValue: {
        type: STRING,
        allowNull: false,
      },
      configurableUnit: {
        type: STRING,
        allowNull: true,
      },
      configurableType: {
        type: STRING,
        allowNull: false,
      },
      createdAt: {
        type: DATE,
        defaultValue: NOW,
      },
      updatedAt: {
        type: DATE,
        defaultValue: NOW,
      },
    };
}

const Configuration = sequelize.define(Tables.CONFIGURATIONS, ConfigurationSchema.configuration);
sequelize.sync();
export default Configuration;
