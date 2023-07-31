import Express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import { v4 as uuidV4 } from "uuid";
const app = Express();
const server = http.createServer(app);
const io = new Server(server);

app.set("view engine", "ejs");
app.use(Express.static("public"));

app.get("/", (_req: Request, _res: Response) => {
  return _res.redirect(`${uuidV4()}`);
});

app.get("/:room", (_req: Request, _res: Response) => {
  return _res.render("room", { roomId: _req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId: string, userId: number) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-connected", userId);
    });
  });
});
server.listen(5000, () => {
  console.log(`server running on port${5000}`);
});
