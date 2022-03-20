import { NextFunction, Request, Response } from "express";
import { ErrnoException, ServerError } from "./types/general-types";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { logger } from "./utils/logger";
import morgan from "morgan";
import passport from "passport";

// Modules that will be used by App //

import * as UserModule from "./models/User";
import * as BikeModule from "./models/Bike/index";
import { resolvers, typeDefs } from "./resolvers/bikeResolver";
import { dbConnect } from "./database";
import { requireLogin } from "./middleware/requireLogin";
// startup
require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors());
app.use(passport.initialize());

app.use(morgan("combined", { stream: logger.stream })); // Combine morgan's console logs with winston logs
app.use("/api", UserModule.router, requireLogin);
app.use("/api", BikeModule.router, requireLogin);
app.use("/graphql", requireLogin);

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
dbConnect().then(async () => {
  const server = new ApolloServer({ typeDefs, resolvers });
  app.listen(port);
  await server.start();
  server.applyMiddleware({ app });

  app.on("listening", function (): void {
    logger.info(`Listening on ${port}`, null);
  });
  app.on("error", onError);

  function onError(error: ErrnoException | any) {
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
