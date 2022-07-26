import * as sonarqubeScanner from "sonarqube-scanner";
sonarqubeScanner({
  serverUrl: 'https://sonar.sterlitetech-software.com:9443/',
  options: {
    "sonar.sources": "src",
    "sonar.inclusions": "src/**", // Entry point of your code
    "sonar.projectName": "dep7-configurator-mtn",
    "sonar.projectVersion": "1",
    "sonar.login": "venu.gopal",
    "sonar.password": "Nov@2021",
    "sonar.javascript.lcov.reportPaths": "coverage/lcov.info"
  },
});
