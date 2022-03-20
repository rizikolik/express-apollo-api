import { NextFunction, Request, Response } from "express";
import { ServerError } from "./types/general-types";

import express from "express";
import path from "path";
import cors from "cors";
// eslint-disable-next-line no-unused-vars
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { logger } from "./utils/logger";
import morgan from "morgan";
import passport from "passport";
// Modules that will be used by App //

import * as UserModule from "./models/User";
import * as BikeModule from "./models/Bike/index";
import { dbConnect } from "./database";
// startup
require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors());
app.use(passport.initialize());

app.use(morgan("combined", { stream: logger.stream })); // Combine morgan's console logs with winston logs
app.use("/api", UserModule.router);
app.use("/api", BikeModule.router);

// error handler
app.use(function (
  err: ServerError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // add this line to include winston logging
  logger.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  );

  // render the error page
  res.status(err.status || 500).json({ error: res.locals.message });
});
const port = process.env.PORT || 8000;

app.set("port", port);
dbConnect().then(() => {
  const server = app.listen(port);

  server.on("listening", function (): void {
    const addr = server.address();
    const bind =
      typeof addr === "string" ? `pipe ${addr}` : `port ${addr?.port}`;
    logger.info(`Listening on ${bind}`, null);
  });
  server.on("error", onError);

  function onError(error: NodeJS.ErrnoException) {
    if (error.syscall !== "listen") {
      throw error;
    }

    const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
});
