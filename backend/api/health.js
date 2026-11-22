// Vercel serverless entry point for /api/health.
// Each /api/*.js file maps to its own endpoint, so no rewrite is needed.
import { createHandler } from "../src/server.js";

const handler = createHandler();

export default function (req, res) {
  return handler(req, res);
}
