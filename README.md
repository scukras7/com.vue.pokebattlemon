# Pokebattlemon
Vue application that provides a Pokemon battle simulator from Pokemon version Blue, Red and Yellow

### Contents
1. [Requirements](#requirements)
1. [Introdution](#introduction)
1. [Application Environment Variables](#application-environment-variables)
1. [Application Setup](#application-setup)

### Requirements
1. Vue.js v3
1. Nodejs v16
1. Java v17
1. Python v3
1. MongoDB v5
1. Docker v20

### Introduction
This application was started as a demo application combining various technologies, Vue.js, Nodejs, Java (Micronaut), Python, MongoDB and Docker, for my resume and as a fun project to work on.  When thinking of an idea of an application to build to demo my know-how, I decided to create a pokemon related app as I've always been a fan of it and have great memories of playing Pokemon Blue and Yellow a lot on my Gameboy Color as kid.  Not only did I learn more about each of the technologies, I also learned about the mechanics behind the Gen. 1 Pokemon games.  In many ways, to get this application off the ground and to a running state I have simplified the game's mechanics in this app or omitted some features from the Gen. 1 games.  However, this provides a nice area of opportunity to continue building and working on feature releases in the future.

### Application Environment Variables
Each service in docker-compose has its own environment variables that need set for your deployment.  Please follow the following instructions to create the necessary files

1. 
```text
# path
com.vue.pokebattlemon/client
touch .env.production
```
.env.production
```text
VUE_APP_GRAPHQL_HOST=http://localhost
VUE_APP_GRAPHQL_PORT=7771
VUE_APP_REST_API_HOST=http://localhost
VUE_APP_REST_API_PORT=7772
VUE_APP_FILESERVER_REST_API_HOST=http://localhost
VUE_APP_FILESERVER_REST_API_PORT=7773
```
2. 
```text
# path
com.vue.pokebattlemon/server
touch .env.prod
```
.env.prod
```text
PORT=7770
```
3. 
```text
# path
com.graphql.pokebattlemon/server
touch .env.prod
```
.env.prod
```text
PRODUCTION=true
UAT=false
PORT=7771
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_USER=
MONGO_PASS=
MONGO_DB=pokedex
MONGO_AUTHDB=pokedex
```
4. 
```text
# path
com.java.api.pokebattlemon/src/main/resources
touch application-prod.yml
```
application-prod.yml
```yaml
micronaut:
  application:
    name: pokebattlemon
  server:
    port:
      7772
    cors:
      enabled: true
      configurations:
        web:
          allowedOrigins:
            - http://localhost:7770
          allowedMethods:
            - GET
            - POST
            - OPTIONS

mongodb:
  uri: mongodb://USER:PASSWORD@mongo:27017/?authSource=pokebattlemon
  database:
    name: pokebattlemon
    collection:
      users: users
      battleIds: battleIds
      benches: benches
      moves: moves
      faints: faints
      winners: winners
```
5. 
```text
# path
com.node.pokebattlemon.fileserver/server
touch .env.prod
```
.env.prod
```text
PRODUCTION=true
UAT=false
PORT=7773
API_VERSION=v1
RESOURCE_DIR=/resources/mp4
```

### Application Setup
To setup the project and deploy it locally follow these steps:
#### Clone Git repositories
```sh
git clone https://github.com/scukras7/com.vue.pokebattlemon.git
git clone https://github.com/scukras7/com.graphql.pokebattlemon.git
git clone https://github.com/scukras7/com.java.api.pokebattlemon.git
git clone https://github.com/scukras7/come.node.pokebattlemon.fileserver.git
git clone https://github.com/scukras7/com.python.pokebattle.etl.git
```
#### Setup MongoDB and Application Startup
First run the following commands to create users on the **pokedex** and **pokebattlemon** databases
```sh
docker-compose up -d mongo
docker exec -it mongo bash
mongo
use pokedex
db.createUser({ user: 'USER', roles: 'readWrite', pwd: passwordPrompt() })
use pokebattlemon
db.createUser({ user: 'USER', roles: 'readWrite', pwd: passwordPrompt() })
exit
exit
docker-compose down mongo
```
Next, the mongo database needs restarted with authorization enabled.  **Uncomment** the **command** line in the docker-compose.yml for the mongo service
```yaml
mongo:
    image: mongo:latest
    container_name: mongo
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - /Users/scott/Desktop/mongo:/data/db
    networks:
      - pbm_network
    #command: --auth
```
Now start all Docker services
```sh
docker-compose up -d
```