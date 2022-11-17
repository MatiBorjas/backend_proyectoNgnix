import { Router } from "express";
const loginRouter = Router();
import { loginController } from "../controller/loginController.js";
import passport from "passport";

loginRouter.get("/", loginController.get);
loginRouter.get("/faillogin", loginController.errorLogin);

loginRouter.post(
  "/", 
  passport.authenticate("login", { failureRedirect: "/login/faillogin" }),
  loginController.postLogin
);

export default loginRouter;