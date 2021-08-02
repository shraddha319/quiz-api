const {
  PORT,
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_TEST,
  NODE_ENV,
  SALT_WORK_FACTOR,
  JWT_SECRET,
} = process.env;

const DB_CONNECTION_STRING = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.xnwmi.mongodb.net/${
  NODE_ENV === 'test' ? DB_TEST : DB_NAME
}?retryWrites=true&w=majority`;

module.exports = {
  PORT,
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_CONNECTION_STRING,
  NODE_ENV,
  SALT_WORK_FACTOR,
  JWT_SECRET,
};
