# NodeJS Sample code to Create rest api using Typescript and Express Framewor

For Migration

- Run: $ npm run migrate

For Seeder

- Run: $ npm run seed

Run Docker Compose 

- docker-compose up --build

Node application with SonarQube

1. Setup docker in local machine
2. docker run -d --name SonarQube -p 9000:9000 -p 9092:9092 sonarqube
3. Open the Browser: http://localhost:9000
4. Login: admin, Password: admin
5. Old Password: admin, setup new password locally
6. Update credentials in sonar-project.ts
7. Run: $ npm run sonar


