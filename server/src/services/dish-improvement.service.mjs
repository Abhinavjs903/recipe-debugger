import { getCulinaryGuidance } from "./culinary-guidance.service.mjs";

const GOALS = new Set(["aroma", "flavour", "texture", "balance"]);

export function buildDishImprovements(input) {
  const dish = String(input.dish).trim();
  const goal = String(input.goal).trim().toLowerCase();
  const cookingMethod = input.cookingMethod?.trim() || null;
  const ingredients = input.ingredients.map((item) => ({
    name: item.name.trim(),
    normalizedName: item.name.trim().toLowerCase(),
    quantity: item.quantity?.trim() || null
  }));

  const recommendations = [];
  const unsupportedIngredients = [];

  for (const ingredient of ingredients) {
    const result = getCulinaryGuidance(ingredient.normalizedName, goal);

    if (result.guidance.length === 0) {
      unsupportedIngredients.push({
        name: ingredient.name,
        reason: GOALS.has(goal)
          ? `No curated ${goal} guidance is available for this ingredient yet.`
          : "The requested improvement goal is not supported."
      });
      continue;
    }

    for (const item of result.guidance) {
      recommendations.push({
        id: item.id,
        ingredient: ingredient.name,
        quantityProvided: ingredient.quantity,
        action: item.action,
        reason: item.reason,
        expectedEffect: item.expectedEffect,
        evidenceLevel: item.evidenceLevel,
        evidenceConfidence: "moderate",
        confidenceNote: "The mechanism is supported by curated sources, but this rule has not been validated against the full dish, ingredient quantity, or the user's exact cooking process.",
        caveat: item.caveat,
        sources: result.sources.filter((source) => item.sourceIds.includes(source.id))
      });
    }
  }

  return {
    dish,
    goal,
    cookingMethod,
    recommendations,
    unsupportedIngredients,
    resultStatus: recommendations.length
      ? (unsupportedIngredients.length ? "partial" : "recommendations-available")
      : "insufficient-curated-evidence",
    limitations: [
      "Recommendations are ingredient-level curated rules, not a diagnosis of the complete dish.",
      "Ingredient quantities are recorded for context but are not currently used to scale recommendations.",
      "Cooking method is recorded but is not yet used to infer cooking time, temperature, or process details.",
      "Only validated rules for the requested goal are returned; missing coverage is reported rather than guessed."
    ]
  };
}
