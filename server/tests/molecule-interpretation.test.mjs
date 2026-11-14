import test from "node:test";
import assert from "node:assert/strict";
import { explainMolecules } from "../src/services/molecule-interpretation.service.mjs";

test("explains only compounds present in the curated guide", () => {
  const result = explainMolecules([
    { common_name: "Diallyl Disulfide", pubchem_id: 16590 },
    { common_name: "Linalool", pubchem_id: 6549 },
    { common_name: "nicotine", pubchem_id: 89594 }
  ]);

  assert.equal(result.insights.length, 2);
  assert.equal(result.insights[0].name, "Diallyl Disulfide");
  assert.equal(result.insights[0].pubchemId, 16590);
  assert.equal(result.insights[1].family, "terpene alcohol");
  assert.equal(result.method, "curated-allowlist");
  assert.equal(result.unclassifiedCount, 1);
  assert.match(result.note, /not proof/i);
});

test("deduplicates repeated molecules and handles missing input", () => {
  const result = explainMolecules([
    { common_name: "Linalool" },
    { common_name: "linalool" }
  ]);

  assert.equal(result.insights.length, 1);
  assert.equal(result.unclassifiedCount, 1);
  assert.equal(explainMolecules().insights.length, 0);
});
