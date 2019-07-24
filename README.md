# Luiza Labs Hiring Test - Employees Manager

Employees manager is an api to manage employees data.

# Tech area

Dependencies used on development:

- Node v10.16.0
- Yarn v1.17.3
- Docker v18.09.2
- MongoDB v4.0

The application is written in node with express framework and mongo db as database.

Yarn is used to manage dependencies and tasks.

Docker is used to run the application in "production mode" and guarantee their functionality in different environments.

# How to use

## Install dependencies
```sh
yarn install
```

## Run all tests
```sh
yarn test
```

## Run unit tests
```sh
yarn test:unit
```

## Run integration tests (Needs an instance of mongo db running)
```sh
yarn test:integration
```

## Build application
```sh
yarn build
```

## Start application
```sh
yarn start
```
