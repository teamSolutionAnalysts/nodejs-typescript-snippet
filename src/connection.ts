import { config } from "dotenv";
import { Sequelize } from "sequelize";

config();
export class Connection {

    public static get(): Connection {
      if (!Connection.instance) {
        // create sequizile instance if not availble
        Connection.instance = new Connection();
      }

      return Connection.instance;
    }
    private static instance: Connection;

    public sequelize;

    private constructor() {
      this.sequelize = new Sequelize(process.env.DATABASE, process.env.DBUSER, process.env.DBPASSWORD, {
        host: process.env.DBHOST,
        port: +process.env.DBPORT,
        dialect: "mysql",
        logging: false,
        dialectOptions: {
          multipleStatements: true,
        },
      });
    }
}
