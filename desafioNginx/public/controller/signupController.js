import { errorLogger } from "../src/utils/loggers";

export const signupController = {
    get: (req, res) => {
      try {
        if (req.isAuthenticated()) {
          res.redirect("/home");
        } else {
          res.render("pages/signup");
        }
      } catch (error) {
        errorLogger.error({
          error: error.message,
        });
        return res
          .status(500)
          .send({ status: "Get page Sign Up error", body: error });
      }
    },
    postsignup: (req, res) => {
      try {
        const { username } = req.user;
        req.session.username = username;
        res.redirect("/home");
      } catch (error) {
        errorLogger.error({
          error: error.message,
        });
        return res.status(500).send({ status: "Sign Up error", body: error });
      }
    },
  
    errorSignup: (req, res) => {
      try {
        res.render("pages/errorSignup");
      } catch (error) {
        errorLogger.error({
          error: error.message,
        });
        res.status(500).send({ status: "Sign Up error", body: error });
      }
    },
  };