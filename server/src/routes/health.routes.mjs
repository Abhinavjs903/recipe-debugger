import { Router } from "express";
import { env } from "../config/env.mjs";

const router = Router();
router.get("/", (req, res) => res.json({
  success: true,
  data: {
    status: "ok",
    service: "FlavoLens API",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString()
  }
}));
export default router;
