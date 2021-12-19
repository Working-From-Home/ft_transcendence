[![CI](https://github.com/ggjulio/poc_dockerize_nestjs/actions/workflows/ci.yml/badge.svg)](https://github.com/ggjulio/poc_dockerize_nestjs/actions/workflows/ci.yml)


### ft_transcendence

#### getting started
Download the repo :
```bash
git clone https://github.com/Working-From-Home/ft_transcendence.git && cd ft_transcendence
```
Create a `.env` file, template example:
```
DB_NAME=db.sqlite   # will be useless
JWT_SECRET=my_secret
# must feed a valid 42 api key -> https://api.intra.42.fr/apidoc/guides/getting_started
API_KEY_42=

# Database settings
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_DATABASE=ft_pong
POSTGRES_PASSWORD=qwerty

#PgAdmin
PGADMIN_DEFAULT_EMAIL=pong@pong.com
PGADMIN_DEFAULT_PASSWORD=qwerty

#typeorm 
# https://stackoverflow.com/questions/62143322/typeorm-config-with-env-variables
# https://typeorm.io/#/using-ormconfig/using-ormconfigjs
# https://medium.com/@rcuni8/create-expressjs-server-with-typeorm-and-postgres-using-docker-and-docker-compose-66f1ebc9d94b
```

Then build and run all services :
```bash
docker-compose up --build
```
Then to either run tests, use vue/nest cli, install packages, or use node,
open a new zsh in one of the container :
```bash
docker-compose exec frontend zsh
```
```bash
docker-compose exec backend zsh
```

#### Links
###### access our beautiful website
- http://localhost:8080
###### PgAdmin (an ui for postgres)
- http://localhost:8081/
###### openapi design first
(Render better in [stoplight elements](https://elements-demo.stoplight.io/?spec=https://raw.githubusercontent.com/Working-From-Home/ft_transcendence/main/reference/api.oas3.yaml#/))
(Or in stoplight studio https://stoplight.io/studio )
- http://localhost:8082
###### Backend rest api
- http://localhost:3000/
###### proxy/mock backend rest api
- http://localhost:3001/
###### access the swagger code first (remove ? it cause dependabot warning and not really useful for planing routes)
- http://localhost:3000/api

###### access compodoc (just for testing how it works, maybe useless for api endpoints because of swagger)
- http://localhost:8080
