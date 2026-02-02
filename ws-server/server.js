const WebSocket = require("ws");
const express = require("express");

const WS_PORT = 8080;
const HTTP_PORT = 8090;

// =======================
// WebSocket Server
// =======================
const wss = new WebSocket.Server({ port: WS_PORT });

// Map<displayId, Set<WebSocket>>
const rooms = new Map();

function broadcast(displayId, payload) {
  const clients = rooms.get(displayId);
  if (!clients) return;

  const message = JSON.stringify(payload);

  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

wss.on("connection", (ws) => {
  console.log("🔌 WS cliente conectado");

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg.toString());

      // 🔑 JOIN NA SALA DO DISPLAY
      if (data.type === "JOIN_DISPLAY") {
        const displayId = data.displayId;

        if (!displayId) return;

        ws.displayId = displayId;

        if (!rooms.has(displayId)) {
          rooms.set(displayId, new Set());
        }

        rooms.get(displayId).add(ws);

        console.log(`📺 Display conectado: ${displayId}`);
      }
    } catch (err) {
      console.error("WS MESSAGE ERROR:", err);
    }
  });

  ws.on("close", () => {
    const displayId = ws.displayId;
    if (!displayId) return;

    const room = rooms.get(displayId);
    if (!room) return;

    room.delete(ws);
    if (room.size === 0) rooms.delete(displayId);

    console.log(`❌ Display desconectado: ${displayId}`);
  });
});

console.log(`🚀 WebSocket rodando em ws://192.168.0.129:${WS_PORT}`);


// =======================
// HTTP → WS Bridge
// =======================
const app = express();
app.use(express.json());

app.post("/emit", (req, res) => {
  const { displayId, event, payload } = req.body;

  if (!displayId || !event) {
    return res.status(400).json({
      error: "displayId e event são obrigatórios",
    });
  }

  console.log("📡 Emitindo evento:", event, "→", displayId);

  broadcast(displayId, {
    event,
    payload: payload ?? null,
  });

  res.json({ ok: true });
});

app.listen(HTTP_PORT, () => {
  console.log(
    `🌐 HTTP bridge rodando em http://192.168.0.129:${HTTP_PORT}`
  );
});
