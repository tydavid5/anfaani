// Vercel serverless entry point. Reuses the same handler as the local server.
// Vercel maps this file to /api/index; vercel.json rewrites /api/* to it.
import { createHandler } from "../src/server.js";

const handler = createHandler();

export default function (req, res) {
  return handler(req, res);
}
