// Vercel serverless entry point for /api/alerts.
import { createHandler } from "../src/server.js";

const handler = createHandler();

export default function (req, res) {
  return handler(req, res);
}
