import { Router } from "express";
import { z } from "zod";
import { getIngredientIntelligence } from "../services/ingredient-intelligence.service.mjs";
import { asyncHandler } from "../utils/async-handler.mjs";

const router = Router();
const querySchema = z.object({
  name: z.string().trim().min(2).max(80)
});

router.get("/ingredient", asyncHandler(async (req, res) => {
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: "Provide an ingredient name (2–80 characters)." }
    });
  }

  const data = await getIngredientIntelligence(parsed.data.name);
  res.json({
    success: true,
    data,
    meta: { source: "Foodoscope", version: 1 }
  });
}));

export default router;
