# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- docker engine or docker desktop - [Download & Install Docker Engine](https://docs.docker.com/engine/install/)

## Downloading

```
git clone {repository URL}
```


## Create .env file

Copy file `.env.example` as `.env` and set custom port if you wish.

## Run DB in docker container

```
docker compose up --build
```

## Installing NPM modules

```
npm install
```

## Start app

```
npm run start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing


To run all test with authorization

```
npm run test:auth
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
