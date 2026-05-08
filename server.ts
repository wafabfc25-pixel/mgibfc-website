import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import contactHandler from "./api/contact.ts";
import chatHandler from "./api/chat.ts";
import analyticsHandler from "./api/analytics.ts"; // NOUVEAU

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/contact", contactHandler);
  app.post("/api/chat", chatHandler);
  app.get("/api/analytics", analyticsHandler); // NOUVEAU

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {  // Correction : "*all" → "*"
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();