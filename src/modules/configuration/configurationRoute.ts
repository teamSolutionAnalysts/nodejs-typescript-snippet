// Import only what we need from express
import { Router } from 'express';
import { Middleware } from '../../middleware';
import { ConfigurationController } from './configurationController';

// Assign router to the express.Router() instance
const router: Router = Router();
const configurationController: ConfigurationController = new ConfigurationController();
const middleware = new Middleware();

router.post('/', middleware.setGlobalRquestId, middleware.setMicroserviceRequestId, middleware.authenticateUser, configurationController.setConfigurations);
router.get('/', middleware.setGlobalRquestId, middleware.setMicroserviceRequestId, middleware.authenticateUser, configurationController.getConfigurations);
router.get('/sync', middleware.setGlobalRquestId, middleware.setMicroserviceRequestId, middleware.authenticateUser, configurationController.syncHazelcast);

// Export the express.Router() instance to be used by server.ts
export const ConfigurationRoute: Router = router;
