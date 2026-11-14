import { getFoodoscope } from "../config/foodoscope.mjs";

const client = () => getFoodoscope();

export const foodoscopeService = {
  searchRecipes(title, page = 1, limit = 8) {
    return client().get("/recipe2-api/recipe-bytitle/recipeByTitle", { title, page, limit });
  },
  getRecipeById(id) {
    return client().get(`/recipe2-api/search-recipe/${encodeURIComponent(id)}`);
  },
  getRecipeInstructions(id) {
    return client().get(`/recipe2-api/instructions/${encodeURIComponent(id)}`);
  },
  getIngredientPairings(name) {
    return client().get("/flavordb/food/by-alias", { food_pair: name });
  },
  getIngredientFlavorLinks(name, page = 0, size = 10) {
    return client().get("/flavordb/connections/links", { entity_alias_readable: name, page, size });
  }
};
