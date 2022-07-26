import * as chai from "chai";
import chaiHttp = require("chai-http");
import "mocha";
import App from "../index";
import { ConfigurationController } from '../modules/configuration/configurationController';
import { ConfigurationUtils } from '../modules/configuration/configurationUtils';
import { Hazelcast } from '../helpers/hazelcast';

const configurationController: ConfigurationController = new ConfigurationController();
const configurationUtils: ConfigurationUtils = new ConfigurationUtils();
const hazelcast: Hazelcast = new Hazelcast();
chai.use(chaiHttp);
const app: any = App.app;
const SUCCESS_MESSAGE = 'should return success message';

describeCall('Failed Get configuration', 'should return Erorr response with Response code', "/api/get-configuration", 404);

describeCall('Get All configuration', 'should return response on call with all configuration', "/api/configuration", 200);

describeCall('Get configuration by key', 'should return specific configuration', "/api/configuration?fields=restAPI.dBRM.getInvoiceHistory", 200);

describe("Set configuration ", () => {
    it(SUCCESS_MESSAGE, () => {
        return chai.request(app).post("/api/configuration?fields=checkout").send(
            {
                "usage.paymentHistory.defaultDuration": "90 Days",
            },
        ).then((res) => {
            chai.expect(res).to.have.status(200);
        });
    });
});

describeCall("Sync configuration to hazelcast", SUCCESS_MESSAGE, "/api/configuration/sync", 200);

describeCall("Check Heath of the API", SUCCESS_MESSAGE, "/api/isHealthy", 200);

describeCall("Check ananoymus URLs", SUCCESS_MESSAGE, "/api/sdfsdfsd", 404);

function describeCall(describeMsg, describeTitle, apiRoute, expectCode) {
    describe(describeMsg, () => {
        it(describeTitle, () => {

            return chai.request(app).get(apiRoute)
                .then((res) => {
                    chai.expect(res).to.have.status(expectCode);
                });
        });
    });
}

describe("Get All configuration from database", () => {
    it("'should return response on call with all configuration from database'", () => {     
        return chai.request(app).get("/api/configuration?fromDB=1")
            .then((res) => {
                chai.expect(res).to.have.status(200);
            });
    });
});