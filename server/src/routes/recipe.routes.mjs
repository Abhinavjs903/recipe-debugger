import { Router } from "express";
import { z } from "zod";
import { foodoscopeService } from "../services/foodoscope.service.mjs";
import { asyncHandler } from "../utils/async-handler.mjs";

const router = Router();
const searchSchema = z.object({
  title: z.string().trim().min(2).max(100),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(20).default(8)
});

router.get("/search", asyncHandler(async (req, res) => {
  const parsed = searchSchema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({
    success: false,
    error: { code: "VALIDATION_ERROR", message: "Provide a dish or recipe title (2–100 characters)." }
  });
  const data = await foodoscopeService.searchRecipes(parsed.data.title, parsed.data.page, parsed.data.limit);
  res.json({ success: true, data, meta: { source: "RecipeDB", cachedByProvider: true } });
}));

router.get("/:id", asyncHandler(async (req, res) => {
  const id = z.string().trim().min(1).max(100).safeParse(req.params.id);
  if (!id.success) return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Invalid recipe id." } });
  const data = await foodoscopeService.getRecipeById(id.data);
  res.json({ success: true, data, meta: { source: "RecipeDB" } });
}));

router.get("/:id/instructions", asyncHandler(async (req, res) => {
  const id = z.string().trim().min(1).max(100).safeParse(req.params.id);
  if (!id.success) return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Invalid recipe id." } });
  const data = await foodoscopeService.getRecipeInstructions(id.data);
  res.json({ success: true, data, meta: { source: "RecipeDB" } });
}));

export default router;
