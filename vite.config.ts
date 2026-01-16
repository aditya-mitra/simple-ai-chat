import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "api-middleware",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url === "/api/chat" && req.method === "POST") {
            let body = "";
            req.on("data", (chunk) => {
              body += chunk.toString();
            });
            req.on("end", async () => {
              try {
                const { POST } = await import("./src/api/chat");
                const request = new Request("http://localhost/api/chat", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body,
                });
                const response = await POST(request);

                res.writeHead(response.status, {
                  "Content-Type":
                    response.headers.get("Content-Type") || "text/plain",
                });

                if (response.body) {
                  const reader = response.body.getReader();
                  const pump = async () => {
                    const { done, value } = await reader.read();
                    if (done) {
                      res.end();
                      return;
                    }
                    res.write(value);
                    pump();
                  };
                  pump();
                }
              } catch (error) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: "Internal server error" }));
              }
            });
          } else {
            next();
          }
        });
      },
    },
  ],
});
