import { config } from 'dotenv';
import * as express from 'express';
import * as helmet from 'helmet'; // Security
import * as i18n from 'i18n';
import * as methodOverride from 'method-override'; // simulate DELETE and PUT (express4)
import { serve, setup } from 'swagger-ui-express';
import { Constants } from './config/constants';
import { Log } from './helpers/logger';
import { ConfigurationUtils } from './modules/configuration/configurationUtils';
import { Routes } from './routes';
import { swaggerDocument } from './swagger/swagger.config';
import { Connection } from './connection';
import { Hazelcast } from './helpers/hazelcast';

config();

export class App {
  public app: express.Application;
  private readonly logger = Log.getLogger();
  private readonly configurationUtils = new ConfigurationUtils();

  constructor () {
    let ONLINE = true;
    const gracefulShutdownTime = 15000;

    this.app = express();
    this.app.use(helmet());
    this.app.all("/*", (req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Request-Headers", "*");
      res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept,Access-Control-Allow-Headers, Authorization");
      res.header("Access-Control-Allow-Methods", "GET, POST");
    i18n.configure({
      directory: "src/locales",
      default: "en",
    });
    this.app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
    this.app.use(express.json(), (error, req, res, next) => {
      if (error) {
        return res.status(Constants.FAIL_CODE).json({ error: i18n.__("ERR_GENRIC_SYNTAX") });
      }
      next();
    });
    this.app.use(express.json({ type: "application/vnd.api+json" })); // parse application/vnd.api+json as json
    this.app.use(methodOverride());
    const routes = new Routes();
    this.app.use(i18n.init);
    this.app.use("/api/swagger", serve, setup(swaggerDocument));
    this.app.use("/api", routes.path());
    this.configurationUtils.syncHazelcast();
    const server = this.app.listen(`${process.env.PORT}`, () => {
      this.logger.info(`The server is running in port localhost: ${process.env.PORT}`);
      this.app.use((err: any, req: any, res: any, next: () => void) => {
        if (err) {
          res.status(Constants.INTERNAL_SERVER_ERROR_CODE).json({ error: i18n.__("ERR_INTERNAL_SERVER") });
          return;
        }
        next();
      });
    });

    // Graceful Shutdown in NodeJS
    const logger = this.logger;
    this.app.get('/health-check', (req, res) => {
      console.log(ONLINE ? 'OK' : 'Server shutting down');
      ONLINE ? res.send('OK') : res.status(503).send('Server shutting down');
    });
    this.app.get('/long-response', (req, res) =>
      setTimeout(() => {
        console.log('Finally! OK');
        res.send('Finally! OK');
      }, gracefulShutdownTime)
    );
    // Handle process interrupt/terminate signal
    const gracefulShutdownHandler = function gracefulShutdownHandler (signal) {
      ONLINE = false;
      setTimeout(() => {
        logger.info(`${signal} signal received`);
        logger.info('Gracefully shutting down application');
        // Stops the server from accepting new requests from client and finishes existing requests.
        server.close(async function (err) {
          // If error, log and exit with error (1 code)
          if (err) {
            logger.error(err);
            process.exit(1);
          }
          logger.info('Http server closed');
          // Close all resource connections
          const sequelize = Connection.get().sequelize;
          await sequelize.close();
          logger.info('Database connection closed');
          // eslint-disable-next-line no-new
          await new Hazelcast();
          logger.info('Hazelcast connection closed.');
          // Exit from process with success (0 code)
          process.exit(0);
        });
      }, 0);
    };
    // The SIGTERM signal is sent to a process to request its termination.
    process.on('SIGTERM', gracefulShutdownHandler);
    // The SIGINT signal is sent to a process by its controlling terminal when a user wishes to interrupt the process.
    process.on('SIGINT', gracefulShutdownHandler);
    // Windows graceful stop
    process.on('message', (msg) => {
      if (msg === 'shutdown') {
        gracefulShutdownHandler('shutdown-with-message');
      }
    });
  }
}
