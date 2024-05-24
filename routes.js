const router = require("express").Router();
const passport = require("passport");
const User = require("./models/user");
const Game = require("./models/game");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/game");
  }
  const errorMessage = req.flash("error");
  res.render("login", { errorMessage });
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
    failureMessage: true,
  }),
  function (req, res) {
    res.redirect("/game");
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
  if (req.isAuthenticated()) res.redirect("/game");
  res.render("register", {
    errorMessage: null,
  });
});

router.post("/register", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/game");
  }
  const newUser = new User({
    name: req.body.name,
    username: req.body.username,
  });
  User.register(newUser, req.body.password, (err) => {
    if (err) {
      if (err.name === "MissingUsernameError") {
        return res.render("register", {
          errorMessage: "Please enter a username",
        });
      } else if (err.name === "MissingPasswordError") {
        return res.render("register", {
          errorMessage: "Please enter a password",
        });
      } else if (err.name === "UserExistsError") {
        return res.render("register", {
          errorMessage: "This username already exists",
        });
      } else {
        return res.render("register", { errorMessage: "An error occurred" });
      }
    }
    passport.authenticate("local")(req, res, () => {
      return res.redirect("/game");
    });
  });
});

router.get("/game", async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/login");

  const user = req.user;
  let game = await Game.findOne({
    players: user._id,
    status: "ongoing",
  }).populate("players");

  if (!game) {
    const existingGameWithOnePlayer = await Game.findOne({
      status: "ongoing",
      $where: "this.players.length === 1",
    });

    if (existingGameWithOnePlayer) {
      // Add current user to the existing game
      existingGameWithOnePlayer.players.push(user._id);
      await existingGameWithOnePlayer.save();
      game = existingGameWithOnePlayer;
    } else {
      // Create a new game with the current user
      game = new Game({
        players: [user._id],
        grid: Array(10)
          .fill()
          .map(() => Array(10).fill(null)),
      });
      await game.save();
    }
  }
  res.render("game", { user, game });
});

module.exports = router;
