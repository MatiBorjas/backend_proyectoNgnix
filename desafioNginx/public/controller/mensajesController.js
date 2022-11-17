import mongoose from "mongoose";
import schemaMensaje from "../models/schemaMensaje.js";

class MensajesController {
  constructor() {
    try {
      mongoose.createConnection(
        "mongodb+srv://admin:admin123@ecommerce.sewmc4q.mongodb.net/test"),
      { useNewUrlParser: true };      
    } catch (error) {
      console.log(error); 
    }  
}

  async save(mensaje) {
    try {
      let timestamp = new Date();
      mensaje.timestamp = timestamp;
      await schemaMensaje.create(mensaje);
      return mensaje;
    } catch (error) {
      throw Error(error.mensaje);
    }
  }

  async getAll(options) {
    try {
      let mensaje;
      if (options?.sort == true) {
        mensaje = await schemaMensaje.find({}).sort({ timestamp: -1 });
      } else {
        mensaje = await schemaMensaje.find({});
      }

      return mensaje;
    } catch (error) {
      throw Error(error.mensaje);
    }
  } 
}

export default MensajesController;