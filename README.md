# FlavoLens

**Understand ingredients. Improve every dish.**

FlavoLens is a mobile-first cooking companion focused on helping home cooks improve dishes they already make. The backend is designed around grounded culinary data and explicit reasoning—not generic recipe generation.

## Backend setup

Requirements: Node.js 20.19+.

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env`
3. Add your Foodoscope key to `FOODOSCOPE_API_KEY` in `.env`
4. Start the API: `npm run dev:server`
5. Check `http://localhost:5050/api/v1/health`

Run tests with `npm run test:server`.

## API endpoints

- `GET /api/v1/health`
- `GET /api/v1/recipes/search?title=paneer`
- `GET /api/v1/recipes/:id`
- `GET /api/v1/recipes/:id/instructions`
- `GET /api/v1/ingredients/pairings?name=mango`
- `GET /api/v1/ingredients/flavor-links?name=tomato`

The browser/mobile client talks only to FlavoLens. Foodoscope credentials stay on the server.

## Mobile / network access

The API binds to `0.0.0.0` so a phone on the same Wi-Fi can reach it using the computer's LAN IP, for example `http://192.168.1.5:5050`. Set `CLIENT_ORIGIN` to the exact frontend origin(s), comma-separated. For access outside your local network, deploy the backend over HTTPS; do not expose a development server directly to the public internet.

## Data provider constraints

Foodoscope access is subject to the Fork-IT 2026 gateway restrictions documented in `docs/STARTER_GUIDE.md`: campus-network access, rate limits, finite tokens, and key expiry. Responses are cached by the supplied SDK. Do not use CocktailDB in this project.
