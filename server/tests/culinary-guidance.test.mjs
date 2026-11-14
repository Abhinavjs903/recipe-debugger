import test from "node:test";
import assert from "node:assert/strict";
import { getCulinaryGuidance } from "../src/services/culinary-guidance.service.mjs";

test("returns evidence-linked garlic aroma guidance", () => {
  const result = getCulinaryGuidance("garlic", "aroma");
  assert.equal(result.ingredient, "garlic");
  assert.equal(result.guidance.length, 3);
  assert.ok(result.guidance.every((item) => item.sourceIds.length > 0));
  assert.ok(result.sources.length >= 2);
  assert.match(result.limitation, /not a personalized recipe diagnosis/i);
});

test("returns an explicit empty result for unsupported ingredients", () => {
  const result = getCulinaryGuidance("mango", "aroma");
  assert.equal(result.guidance.length, 0);
  assert.match(result.limitation, /No curated culinary guidance/i);
});
