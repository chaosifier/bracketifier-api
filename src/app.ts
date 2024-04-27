import express from "express";
import morgan from "morgan";
import { commonErrorHandler, noRouteMatchHandler } from "./helpers/handlers";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import { connect } from "./helpers/db";
import userRouter from "./users/users.routes";
import tournamentRouter from "./tournaments/tournaments.routes";
import swaggerAutogen from "swagger-autogen";
import swaggerFile from "./swagger-output.json";

import "dotenv/config";
import { verifyToken } from "./users/users.middleware";
// import { verifyToken } from './users/users.middleware';
//deps

//db connection
connect();

//instantiations
const app = express();
const router = express.Router();

//configuration
app.disable("x-powered-by");

//middleware
app.use(cors());
app.use(morgan("combined"));
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

//routes
app.use("/users", userRouter);
app.use("/tournaments", verifyToken, tournamentRouter);

// fallback route
app.all("*", noRouteMatchHandler);

// error handler
app.use(commonErrorHandler);

//bootstrap
app.listen(3000, () =>
  console.log("The server is listening on http://localhost:3000")
);
