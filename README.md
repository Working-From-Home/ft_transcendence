[![CI](https://github.com/ggjulio/poc_dockerize_nestjs/actions/workflows/ci.yml/badge.svg)](https://github.com/ggjulio/poc_dockerize_nestjs/actions/workflows/ci.yml)


### ft_transcendence

#### getting started
Download the repo :
```bash
git clone https://github.com/Working-From-Home/ft_transcendence.git && cd ft_transcendence
```
Create a `.env` file, template example:
```
JWT_SECRET=my_secret
# must feed a valid 42 api key -> https://api.intra.42.fr/apidoc/guides/getting_started
API_KEY_42=

# Must change thoses two variables BEFORE BUILD AND RUN if
# running on 42's linux dump.
# Type the command `id` to get your `uid` and `gid`)
# Also it only works ouside `NFS`, like `/goinfre` or `/tmp`,
# thus, it doesn't works inside `/sgoinfre`, or your home `~/`.
HOST_UID=1000
HOST_GID=1000

# Database settings
POSTGRES_PORT=5432
POSTGRES_USER=pong
POSTGRES_PASSWORD=qwerty
POSTGRES_DATABASE=pong

#PgAdmin container
PGADMIN_DEFAULT_EMAIL=pong@pong.com
PGADMIN_DEFAULT_PASSWORD=qwerty

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

#### Access to ft_pong DB from pgAdmin UI
- open: http://localhost:8081/
- Use pgAdmin credentials from .env file (`PGADMIN_DEFAULT_EMAIL` and `PGADMIN_DEFAULT_PASSWORD`)
- create/add a new server
  - Give it a name
  - Open the `Connection` panel:
    - **Host** : The docker-compose service name of our database ( in our case `postgres`)
    - **Port** : The value of `POSTGRES_PORT` in the `.env` file (default port is `5432`)
    - **Username** : The value of `POSTGRES_USER` in the `.env` file
    - **Password** : The value of `POSTGRES_PASSWORD` in the `.env` file
  - Hit **`Save`** and voila.

#### Setup debug for backend in vscode
```bash
cd backend
```
```bash
mkdir -p .vscode && touch .vscode/launch.json
```
copy paste this into `lauch.json` :
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Attach to node",
            "type": "node",
            "request": "attach",
            "restart": true,
            "port": 9229
        }
    ]
}
```

Important -> Variable `DEBUG=*` must be present in docker-compose.yaml (but spam a lot of logs)

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
