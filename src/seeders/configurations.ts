import { Tables } from "../config/tables";

export function up(queryInterface: any, Sequelize: any = null) {
  return queryInterface.bulkInsert(Tables.CONFIGURATIONS, [
    {
      configurableKey: "otpResendTime",
      configurableValue: "10",
      configurableUnit: "min",
      configurableType: "OTP",
    },
    {
      configurableKey: "otpBlockAfterMaxAttempt",
      configurableValue: "30",
      configurableUnit: "min",
      configurableType: "OTP",
    },
    {
      configurableKey: "otpMaxAttempt",
      configurableValue: "3",
      configurableType: "OTP",
    },
    {
      configurableKey: "otpValidFor",
      configurableValue: "10",
      configurableUnit: "min",
      configurableType: "OTP",
    },
    {
      configurableKey: "minAgeLimit",
      configurableValue: "18",
      configurableUnit: "year",
      configurableType: "DOB",
    },
  ], {});
}

export function down(queryInterface: any, Sequelize: any = null) {
  // Null User - queryInterface.bulkDelete(Tables.USER, null, {});
  return queryInterface.bulkDelete(Tables.CONFIGURATIONS, [{
    name: "Mark Allen",
  }], {});
}
