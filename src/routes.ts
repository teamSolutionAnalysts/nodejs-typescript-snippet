import express = require("express");
import { ConfigurationRoute } from "./modules/configuration/configurationRoute";
import { Connection } from "./connection";
import { Hazelcast } from './helpers/hazelcast';

export class Routes {
  protected basePath: string;
  public hazelcastUtils: Hazelcast = new Hazelcast();
  public path() {
    const router = express.Router();
    router.use("/configuration", ConfigurationRoute);

    router.get("/isHealthy", async (req, res) => {
      const { sequelize } = Connection.get();

      const responseObj = {
        "responseCode": 200,
        "responseMessage": "Configurator management health check success",
        "data": []
      };
      //Step 1 : Hazelcast
      const client = await this.hazelcastUtils.getQueryData('');
      if (client.length > 0) {
        responseObj.data.push({ 'system': 'Hazelcast', 'status': 'Success' });
      } else {
        responseObj.responseCode = 503;
        responseObj.responseMessage = "Configurator management health check fail";
        responseObj.data.push({ 'system': 'Hazelcast', 'status': 'Fail' });
      }

      //Step 2 : Database Connection
      sequelize
        .authenticate()
        .then(async () => {
          responseObj.data.push({ 'system': 'Database', 'status': 'Success' });
          res.status(responseObj.responseCode).json(responseObj)
        })
        .catch(err => {
          responseObj.responseCode = 503;
          responseObj.responseMessage = "Configurator management health check fail";
          responseObj.data.push({ 'system': 'Database', 'status': 'Fail', 'message': 'Unable to connect to the database' });
          res.status(responseObj.responseCode).json(responseObj)
        });
    });

    router.get('/health', async (req, res) => {
      res.status(200).json({ success: true });
    });

    router.all("/*", (req, res) => {
      return res.status(404).json({
        error: req.__("ERR_URL_NOT_FOUND"),
      });
    });
    return router;
  }
}
