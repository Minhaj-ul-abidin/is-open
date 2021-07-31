const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth/v1/auth");

const app = express();

if (process.env.NODE_ENV !== "test") {
  app.use(logger("dev"));
}
// Init global Middlewares
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.options("*", cors());

app.use("/", indexRouter);
app.use("/api/auth/v1", authRouter);

module.exports = app;
