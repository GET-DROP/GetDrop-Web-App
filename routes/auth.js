const express = require("express"); //1.i we create a route for our pages here with router and export to app.js
const passport = require("passport");
const router = express.Router();
const app = express();
const { ensureLogout } = require("../middleware/auth");

// description auth callabck
// route GET /auth/google/
router.get("/google", passport.authenticate("google", { scope: ["profile"] }), (req, res) => {
    try {
    } catch (err) {
      console.error(err);
      res.render("error/500");
    }
  });

// description google auth callabck
// route GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    try {
      res.redirect("/dashboard");
    } catch (err) {
      console.error(err);
      res.render("error/500");
    }
  }
);

// description logout user
// route GET /auth/logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

module.exports = router;
