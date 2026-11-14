import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(5050),
  HOST: z.string().default("0.0.0.0"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  CLIENT_ORIGIN: z.string().default("http://localhost:5173"),
  FOODOSCOPE_API_KEY: z.string().optional().default(""),
  FOODOSCOPE_BASE_URL: z.string().url().default("http://cosylab.iiitd.edu.in:6969"),
  FOODOSCOPE_CACHE_DIR: z.string().default(".foodoscope_cache"),
  FOODOSCOPE_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(25000)
});

export const env = schema.parse(process.env);
