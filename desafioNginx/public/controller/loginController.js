export const loginController = {
  get: (req, res) => {
    try {
      if (req.isAuthenticated()) {
        res.redirect("/home");
      } else {
        res.render("pages/login");
      }
    } catch (error) {
      return res
        .status(500)
        .send({ status: "Get page Log In error", body: error });
    }
  },
  postLogin: (req, res) => {
    try {
      const { username } = req.user;
      req.session.username = username;
      res.redirect("/home");
    } catch (error) {
      return res.status(500).send({ status: "Log In error", body: error });
    }
  },

  errorLogin: (req, res) => {
    try {
      res.render("pages/errorLogin");
    } catch (error) {
      res.status(500).send({ status: "Log In error", body: error });
    }
  },
};