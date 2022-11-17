import { Router } from "express";
import { productosController } from "../controller/productosController.js";

const productosRouter = new Router();
productosRouter.get("/", productosController.getData);

export default productosRouter;