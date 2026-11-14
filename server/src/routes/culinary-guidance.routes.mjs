import { Router } from "express";
import { z } from "zod";
import { getCulinaryGuidance } from "../services/culinary-guidance.service.mjs";
import { asyncHandler } from "../utils/async-handler.mjs";

const router = Router();
const querySchema = z.object({
  ingredient: z.string().trim().min(2).max(80),
  goal: z.string().trim().min(2).max(80).optional()
});

router.get("/culinary-guidance", asyncHandler(async (req, res) => {
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: "Provide an ingredient (2–80 characters) and an optional goal." }
    });
  }

  const data = getCulinaryGuidance(parsed.data.ingredient, parsed.data.goal);
  res.json({
    success: true,
    data,
    meta: { source: "FlavoLens curated culinary evidence", version: 1 }
  });
}));

export default router;
