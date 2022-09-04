const express = require("express");
const apiControll = require("../controller/apiControll");
const userControll = require("../controller/userControll");

const register = express.Router();

register.get("/register", (req, res, next) => {
  res.render("register");
});

register.post("/register", async (req, res, next) => {
  const user = {
    name: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    },
    age: req.body.age,
    username: req.body.username,
    blood: req.body.blood,
    email: req.body.email,
    password: req.body.password,
    address: {
      city: req.body.city,
      road: req.body.road,
      district: req.body.district,
      zip: req.body.zip,
    },
  };
  const created = await userControll.createUser(user, next);
  if (!created) {
    req.flash("error", "User existent!");
    return res.redirect("/register");
  }
  return res.redirect('login');
    
});

register.post("/api/register", apiControll.apiRegister);

module.exports = register;
