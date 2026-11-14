import { Router } from "express";
import { z } from "zod";
import { foodoscopeService } from "../services/foodoscope.service.mjs";
import { asyncHandler } from "../utils/async-handler.mjs";

const router = Router();
const ingredientQuery = z.string().trim().min(2).max(80);

router.get("/pairings", asyncHandler(async (req, res) => {
  const parsed = ingredientQuery.safeParse(req.query.name);
  if (!parsed.success) return res.status(400).json({
    success: false,
    error: { code: "VALIDATION_ERROR", message: "Provide an ingredient name (2–80 characters)." }
  });
  const data = await foodoscopeService.getIngredientPairings(parsed.data);
  res.json({ success: true, data, meta: { source: "FlavorDB" } });
}));

router.get("/flavor-links", asyncHandler(async (req, res) => {
  const name = ingredientQuery.safeParse(req.query.name);
  const page = z.coerce.number().int().min(0).default(0).safeParse(req.query.page ?? 0);
  const size = z.coerce.number().int().min(1).max(20).default(10).safeParse(req.query.size ?? 10);
  if (!name.success || !page.success || !size.success) return res.status(400).json({
    success: false,
    error: { code: "VALIDATION_ERROR", message: "Provide a valid ingredient name, page (0+), and size (1–20)." }
  });
  const data = await foodoscopeService.getIngredientFlavorLinks(name.data, page.data, size.data);
  res.json({ success: true, data, meta: { source: "FlavorDB" } });
}));

export default router;
