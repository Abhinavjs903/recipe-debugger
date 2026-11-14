import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.mjs";
import healthRoutes from "./routes/health.routes.mjs";
import recipeRoutes from "./routes/recipe.routes.mjs";
import ingredientRoutes from "./routes/ingredient.routes.mjs";
import intelligenceRoutes from "./routes/intelligence.routes.mjs";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.mjs";

const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin: env.CLIENT_ORIGIN.split(",").map((origin) => origin.trim()),
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "32kb" }));

app.get("/", (req, res) => res.json({ success: true, message: "FlavoLens API is running." }));
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/recipes", recipeRoutes);
app.use("/api/v1/ingredients", ingredientRoutes);
app.use("/api/v1/intelligence", intelligenceRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
