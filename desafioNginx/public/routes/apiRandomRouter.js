import { Router } from "express";
import { apiRandomController } from "../controller/apiRandomController.js";
const apiRandomRouter = Router();

apiRandomRouter.get("/", apiRandomController.get);

apiRandomRouter.post("/", apiRandomController.post);

export default apiRandomRouter;