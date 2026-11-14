import test from "node:test";
import assert from "node:assert/strict";
import { buildDishImprovements } from "../src/services/dish-improvement.service.mjs";

const sample = {
  dish: "Paneer Butter Masala",
  ingredients: [
    { name: "tomato", quantity: "200g" },
    { name: "garlic", quantity: "4 cloves" },
    { name: "cream", quantity: "50ml" }
  ],
  cookingMethod: "saute and simmer",
  goal: "aroma"
};

test("returns only curated recommendations for supported dish ingredients", () => {
  const result = buildDishImprovements(sample);
  assert.equal(result.dish, "Paneer Butter Masala");
  assert.equal(result.goal, "aroma");
  assert.equal(result.cookingMethod, "saute and simmer");
  assert.equal(result.recommendations.length, 3);
  assert.deepEqual(result.recommendations.map((item) => item.ingredient), ["garlic", "garlic", "garlic"]);
  assert.ok(result.recommendations.every((item) => item.sources.length > 0));
  assert.ok(result.recommendations.every((item) => item.evidenceConfidence === "moderate"));
  assert.deepEqual(result.unsupportedIngredients.map((item) => item.name), ["tomato", "cream"]);
  assert.equal(result.resultStatus, "partial");
});

test("does not invent recommendations for an ingredient without curated rules", () => {
  const result = buildDishImprovements({
    dish: "Mango smoothie",
    ingredients: [{ name: "mango" }],
    goal: "aroma"
  });
  assert.equal(result.recommendations.length, 0);
  assert.equal(result.unsupportedIngredients.length, 1);
  assert.equal(result.resultStatus, "insufficient-curated-evidence");
});

test("does not reuse aroma rules for an unsupported goal", () => {
  const result = buildDishImprovements({
    dish: "Garlic naan",
    ingredients: [{ name: "garlic" }],
    goal: "texture"
  });
  assert.equal(result.recommendations.length, 0);
  assert.equal(result.resultStatus, "insufficient-curated-evidence");
});

test("preserves quantity as context without implying quantity-based scaling", () => {
  const result = buildDishImprovements(sample);
  assert.equal(result.recommendations[0].quantityProvided, "4 cloves");
  assert.ok(result.limitations.some((item) => item.includes("not currently used to scale")));
});
