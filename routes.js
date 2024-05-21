const router = require("express").Router();
const passport = require("passport");
const User = require("./models/user");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/login", (req, res) => {
  if (req.isAuthenticated()) res.redirect("/play");
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    res.redirect("/play");
  }
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log("Error logging out: ", err);
    }
    res.redirect("/");
  });
});

router.get("/register", (req, res) => {
  if (req.isAuthenticated()) res.redirect("/play");
  res.render("register", { error: null });
});

router.post("/register", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/play");
  }
  const newUser = new User({
    name: req.body.name,
    username: req.body.username,
  });
  User.register(newUser, req.body.password, (err) => {
    if (err) {
      if (err.name === "MissingUsernameError") {
        return res.render("register", { error: "Please enter a username" });
      } else if (err.name === "MissingPasswordError") {
        return res.render("register", { error: "Please enter a password" });
      } else if (err.name === "UserExistsError") {
        return res.render("register", {
          error: "This username already exists",
        });
      } else {
        return res.render("register", { error: "An error occurred" });
      }
    }
    passport.authenticate("local")(req, res, () => {
      return res.redirect("/");
    });
  });
});

router.get("/play", (req, res) => {
  if (!req.isAuthenticated()) res.redirect("/login");
  res.render("play", { user: req.user });
});

module.exports = router;
