import express from "express";
import cors from "cors";

import healthRoutes from "./modules/health/health.routes.js";
import usersRoutes from "./modules/users/users.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/users", usersRoutes);

export default app;
