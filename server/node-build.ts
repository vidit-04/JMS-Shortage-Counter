import { createServer } from "./index";

const app = createServer();

// Vercel's Node runtime passes (req, res). An Express app is itself a request handler.
// Export a handler compatible with @vercel/node.
export default function handler(req: any, res: any) {
	return app(req, res);
}
