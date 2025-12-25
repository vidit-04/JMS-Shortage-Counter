import { createServer } from "./index";
import serverless from "serverless-http";

const app = createServer();

// Export serverless handler for Vercel
export default serverless(app);
