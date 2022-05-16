const dotenv = require("dotenv");
const path = require("path");

if (!process.env.HOST) {
  dotenv.config({
    path: path.join(__dirname, "..", ".env"),
  });
}

module.exports = {
  host: process.env.HOST,
  username: process.env.POST_USER,
  password: process.env.PASS,
  port: process.env.DB_PORT,
  database: process.env.DB,
  dialect: "postgres",
};
