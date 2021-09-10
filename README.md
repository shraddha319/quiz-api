# Quiz API

_REST API for the quiz application: [Harry Potter trivia](https://github.com/shraddha319/Harry-Potter-Trivia)_

Built using this [REST API boilerplate](https://github.com/shraddha319/REST-API-boilerplate)

## Features

- **Error Handling**: centralized error handling mechanism
- **Authentication and Authorization**: using [JWT](https://jwt.io)
- **NoSQL database**: [MongoDB](https://www.mongodb.com)
- **Object Data Modeling**:using [Mongoose](https://mongoosejs.com)
- **Validation**: using [Joi](https://github.com/sideway/joi)
- **CORS**: Cross-Origin Resource Sharing enabled using [cors](https://github.com/expressjs/cors)
- **Environment Variables**: using [dotenv](https://github.com/motdotla/dotenv)
- **Dependency Management**: using [npm](https://www.npmjs.com)
- **Linting**: using [ESLint](https://eslint.org) and [Prettier](https://prettier.io)

## Quick Start

Get started by following the below steps:

1. Clone the repo:

```bash
git clone https://github.com/shraddha319/quiz-api.git
cd quiz-api
```

2. Install the dependencies

```bash
npm install
```

## Environment Varibles

The environment variables can be found and modified in the .env file.

## Commands

The following commands can be found under `scripts` in `package.json`.

Run locally:

```bash
npm run dev
```

Run in production:

```bash
npm run start
```

Testing:

```bash
# run all tests
npm run test

# run all tests in watch mode
npm run test:watch

# run test coverage
npm run test:coverage
```

Linting:

```bash
# run ESLint
npm run lint

# fix ESLint errors
npm run lint:fix
```

## API Documentation

### Quiz routes:

`GET /quiz` - get quiz\
`POST /quiz` - add quiz

### Auth routes:

`POST /auth/login` - login user

### User routes:

`POST /users` - create user

(Below routes require user authentication)

`GET /users/:userId` - get user\
`POST /users/:userId` - update user\
`DELETE /users/:userId` - delete user

### Score routes:

`GET /users/:userId/scores` - get leaderboard or user scores\
`POST /users/:userId/scores` - post user score

## License

[MIT](LICENSE)
