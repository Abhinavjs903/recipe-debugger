import { foodoscopeService } from "./foodoscope.service.mjs";

function asRecords(value) {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];
  for (const key of ["content", "data", "results", "items", "entities", "records"]) {
    if (Array.isArray(value[key])) return value[key];
  }
  return [value];
}

function findFirst(object, keys) {
  if (!object || typeof object !== "object") return undefined;
  for (const key of keys) {
    if (object[key] !== undefined && object[key] !== null && object[key] !== "") return object[key];
  }
  for (const value of Object.values(object)) {
    if (value && typeof value === "object") {
      const found = findFirst(value, keys);
      if (found !== undefined) return found;
    }
  }
  return undefined;
}

function normalizeEntity(record) {
  return {
    id: findFirst(record, ["entity_id", "entityId", "id"]),
    name: findFirst(record, ["entity_alias_readable", "entityName", "entity_alias", "name"]),
    category: findFirst(record, ["category_readable", "category"])
  };
}

function normalizePairing(record) {
  return {
    name: findFirst(record, ["entityName", "entity_alias_readable", "name"]),
    category: findFirst(record, ["category", "category_readable"]),
    sharedMoleculeCount: findFirst(record, ["similarMolecules", "similar_molecules"]),
    evidenceType: "shared-molecule-count"
  };
}

function normalizeRecipeLink(record) {
  const connection = record?.recipe ?? record;
  const entity = record?.entity ?? {};
  return {
    ingredient: findFirst(connection, ["ingredient", "generic_name", "entity_alias_readable"]),
    recipeIngredientFrequency: findFirst(connection, ["frequency"]),
    flavorDbEntityId: findFirst(connection, ["flavordb_id"]) ?? findFirst(entity, ["entity_id", "entityId"]),
    recipeId: findFirst(connection, ["Recipe_id", "recipe_id"]),
    connectionRecordId: findFirst(connection, ["_id"])
  };
}

export async function getIngredientIntelligence(name) {
  const [entityResult, pairingResult, linkResult] = await Promise.allSettled([
    foodoscopeService.getIngredientEntities(name),
    foodoscopeService.getIngredientPairings(name),
    foodoscopeService.getIngredientFlavorLinks(name, 0, 10)
  ]);

  const entitiesRaw = entityResult.status === "fulfilled" ? entityResult.value : null;
  const pairingsRaw = pairingResult.status === "fulfilled" ? pairingResult.value : null;
  const linksRaw = linkResult.status === "fulfilled" ? linkResult.value : null;

  const entityRecords = asRecords(entitiesRaw);
  const entities = entityRecords.map(normalizeEntity);
  const selectedEntity = entities.find((entity) => entity.id) ?? entities[0] ?? null;
  let moleculesRaw = null;
  let moleculeError = null;

  if (selectedEntity?.id) {
    try {
      moleculesRaw = await foodoscopeService.getEntityMolecules(selectedEntity.id);
    } catch (error) {
      moleculeError = error.message;
    }
  }

  const errors = {};
  if (entityResult.status === "rejected") errors.entities = entityResult.reason?.message ?? "Entity lookup failed";
  if (pairingResult.status === "rejected") errors.pairings = pairingResult.reason?.message ?? "Pairing lookup failed";
  if (linkResult.status === "rejected") errors.recipeConnections = linkResult.reason?.message ?? "Recipe connection lookup failed";
  if (moleculeError) errors.molecules = moleculeError;

  const pairings = asRecords(pairingsRaw?.topSimilarEntities ?? pairingsRaw).map(normalizePairing);
  const links = asRecords(linksRaw?.content ?? linksRaw).map(normalizeRecipeLink);
  const molecules = asRecords(moleculesRaw);

  return {
    query: name,
    profile: selectedEntity,
    entities,
    pairings,
    pairingMetric: "shared-molecule-count",
    molecules,
    moleculeDataNote: "Provider-returned molecule records are raw chemical associations. They are not filtered to food-safe, aroma-active, or sensory-relevant compounds.",
    recipeConnections: links,
    sources: ["FlavorDB"],
    limitations: [
      "Shared-molecule counts are a similarity signal, not a culinary compatibility score or proof of a desirable pairing.",
      "Molecule records may include compounds that are not relevant to food aroma or suitability; do not present them as recommendations without additional validation.",
      "A connection record identifier is not necessarily a RecipeDB recipe identifier.",
      "Missing fields mean the provider did not return that information for this query."
    ],
    ...(Object.keys(errors).length ? { partial: true, errors } : { partial: false })
  };
}
