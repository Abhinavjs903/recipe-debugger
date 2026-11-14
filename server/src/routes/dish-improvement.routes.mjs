import { Router } from "express";
import { z } from "zod";
import { buildDishImprovements } from "../services/dish-improvement.service.mjs";
import { asyncHandler } from "../utils/async-handler.mjs";

const router = Router();
const requestSchema = z.object({
  dish: z.string().trim().min(2).max(120),
  ingredients: z.array(z.object({
    name: z.string().trim().min(2).max(80),
    quantity: z.string().trim().min(1).max(40).optional()
  })).min(1).max(30),
  cookingMethod: z.string().trim().min(2).max(120).optional(),
  goal: z.enum(["aroma", "flavour", "texture", "balance"])
});

router.post("/dish-improvements", asyncHandler(async (req, res) => {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Provide a dish, 1–30 ingredients, and a supported goal: aroma, flavour, texture, or balance.",
        details: parsed.error.issues.map(({ path, message }) => ({ path, message }))
      }
    });
  }

  const data = buildDishImprovements(parsed.data);
  res.json({
    success: true,
    data,
    meta: { source: "FlavoLens curated culinary evidence", version: 1 }
  });
}));

export default router;
