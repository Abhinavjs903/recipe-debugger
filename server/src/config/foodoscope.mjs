import { Foodoscope } from "../../../starter/js/foodoscope.mjs";
import { env } from "./env.mjs";

let client;
export function getFoodoscope() {
  if (!env.FOODOscope_API_KEY && !env.FOODOSCOPE_API_KEY) {
    throw new Error("FOODOSCOPE_API_KEY is not configured. Add it to your local .env file.");
  }
  client ??= new Foodoscope({
    apiKey: env.FOODOSCOPE_API_KEY,
    baseUrl: env.FOODOSCOPE_BASE_URL,
    cacheDir: env.FOODOSCOPE_CACHE_DIR,
    timeoutMs: env.FOODOSCOPE_TIMEOUT_MS
  });
  return client;
}
