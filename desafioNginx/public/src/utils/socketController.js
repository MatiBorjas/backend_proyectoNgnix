import MensajesController from "../../controller/mensajesController.js";
import { normalizarMensajes } from "../normalizr/normalizarMensajes.js";

const messagesController = new MensajesController();

export const socketController = (io) => {
  io.on("connection", async (socket) => {
    console.log("Nuevo Cliente Conectado: " + socket.id);
    io.sockets.emit(
      "messages",
      normalizarMensajes(await messagesController.getAll())
    );
    //queda escuchando el siguiente socket, socket es el usuario/cliente
    socket.on("new-message", async (msjClient) => {
      await messagesController.save(JSON.parse(msjClient));
      io.sockets.emit(
        "messages",
        normalizarMensajes(await messagesController.getAll({ sort: true }))
      );
    });
  });
};