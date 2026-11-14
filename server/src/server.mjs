import app from "./app.mjs";
import { env } from "./config/env.mjs";

app.listen(env.PORT, env.HOST, () => {
  console.log(`FlavoLens API listening on http://${env.HOST}:${env.PORT}`);
});
