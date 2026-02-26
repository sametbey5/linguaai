
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // Race State Management
  const rooms = new Map(); // roomId -> { players: [], questions: [], status: 'waiting' | 'racing' }

  const WORDS_POOL = [
    { q: "Apple", a: "Elma" },
    { q: "Book", a: "Kitap" },
    { q: "School", a: "Okul" },
    { q: "Friend", a: "Arkadaş" },
    { q: "Water", a: "Su" },
    { q: "Bread", a: "Ekmek" },
    { q: "House", a: "Ev" },
    { q: "Car", a: "Araba" },
    { q: "Sun", a: "Güneş" },
    { q: "Moon", a: "Ay" },
    { q: "Star", a: "Yıldız" },
    { q: "Tree", a: "Ağaç" },
    { q: "Flower", a: "Çiçek" },
    { q: "Bird", a: "Kuş" },
    { q: "Dog", a: "Köpek" },
    { q: "Cat", a: "Kedi" },
    { q: "Fish", a: "Balık" },
    { q: "Milk", a: "Süt" },
    { q: "Cheese", a: "Peynir" },
    { q: "Egg", a: "Yumurta" }
  ];

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_race", ({ userId, name, avatar }) => {
      let roomId = "global_race";
      socket.join(roomId);

      if (!rooms.has(roomId)) {
        rooms.set(roomId, { players: [], questions: [], status: 'waiting' });
      }

      const room = rooms.get(roomId);
      
      // Add or update player
      const playerIndex = room.players.findIndex((p: any) => p.userId === userId);
      const playerData = { socketId: socket.id, userId, name, avatar, progress: 0, finished: false };
      
      if (playerIndex > -1) {
        room.players[playerIndex] = playerData;
      } else {
        room.players.push(playerData);
      }

      io.to(roomId).emit("room_update", room);

      // Start race if enough players
      if (room.players.length >= 2 && room.status === 'waiting') {
        room.status = 'racing';
        // Pick 10 random questions
        room.questions = [...WORDS_POOL].sort(() => 0.5 - Math.random()).slice(0, 10);
        io.to(roomId).emit("race_start", { questions: room.questions });
      }
    });

    socket.on("update_progress", ({ progress }) => {
      const roomId = "global_race";
      const room = rooms.get(roomId);
      if (!room) return;

      const player = room.players.find((p: any) => p.socketId === socket.id);
      if (player) {
        player.progress = progress;
        if (progress >= room.questions.length) {
          player.finished = true;
          player.finishTime = Date.now();
          
          // Check if everyone finished or if this is the first winner
          const winners = room.players.filter((p: any) => p.finished).sort((a: any, b: any) => a.finishTime - b.finishTime);
          if (winners.length === 1) {
             io.to(roomId).emit("winner_announced", player);
          }
        }
        io.to(roomId).emit("room_update", room);
      }
    });

    socket.on("disconnect", () => {
      const roomId = "global_race";
      const room = rooms.get(roomId);
      if (room) {
        room.players = room.players.filter((p: any) => p.socketId !== socket.id);
        if (room.players.length === 0) {
          room.status = 'waiting';
          room.questions = [];
        }
        io.to(roomId).emit("room_update", room);
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
