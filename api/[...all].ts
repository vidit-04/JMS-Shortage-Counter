import { createServer } from "../server/index";

const app = createServer();

// Catch-all API route for Vercel: handles /api/* via Express.
export default function handler(req: any, res: any) {
  return app(req, res);
}
