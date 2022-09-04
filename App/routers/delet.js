const express = require('express');
const authentic = require('../controller/authenticate');
const userControll = require('../controller/userControll');
const delet = express.Router();

const authenticate = authentic;

delet.get("/delete", authenticate, function (req, res) {
  res.render("delete");
}); 

delet.post("/delete", authenticate, async(req, res, next)=>{
  const email = req.body.email;
  const user = await userControll.deleteUser(req.user._id, email, next);
  if (user) {
    req.flash("error", "User not found");
    return res.redirect("/delete");
  }
  return res.redirect("/");
});

module.exports = delet;