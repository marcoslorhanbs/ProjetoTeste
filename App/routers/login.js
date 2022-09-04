const express = require("express");
const passport = require("passport/lib");
const login = express.Router();

login.get("/login", function (req, res) {
  res.render("login");
});

login.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/tech",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

login.get("/logout", (req, res) => {
  req.logout(req.user, (err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});


login.get("/api/logout", (req, res) => {
  req.logout(req.user, (err) => {
    if (err) return next(err);
    res.status(200).json('logout');;
  });
});


module.exports = login;
