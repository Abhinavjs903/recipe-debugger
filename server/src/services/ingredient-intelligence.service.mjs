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
    sharedMoleculeCount: findFirst(record, ["similarMolecules", "similar_molecules"])
  };
}

function normalizeRecipeLink(record) {
  const recipe = record?.recipe ?? record;
  const entity = record?.entity ?? {};
  return {
    ingredient: findFirst(recipe, ["ingredient", "generic_name", "entity_alias_readable"]),
    recipeIngredientFrequency: findFirst(recipe, ["frequency"]),
    flavorDbEntityId: findFirst(recipe, ["flavordb_id"]) ?? findFirst(entity, ["entity_id", "entityId"]),
    recipeId: findFirst(recipe, ["_id", "Recipe_id", "recipe_id"])
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
    molecules,
    recipeConnections: links,
    sources: ["FlavorDB"],
    limitations: [
      "Molecular similarity indicates shared flavour compounds; it does not guarantee that a pairing will taste good in every dish.",
      "Missing fields mean the provider did not return that information for this query."
    ],
    ...(Object.keys(errors).length ? { partial: true, errors } : { partial: false })
  };
}
