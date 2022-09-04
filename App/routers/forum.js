const express = require("express");
const userControll = require("../controller/userControll");
const apiControll = require("../controller/apiControll");
const forum = express.Router();

const authentic = require("../controller/authenticate");
const authenticate = authentic;

forum.get("/user/forum", authenticate, async (req, res, next) => {
  const users = await userControll.getUsers(next);
  res.render("forum", { users: users });
});

forum.post("/user/forum", authenticate, (req, res, next) => {
  req.user.msg = req.body.message;
  req.user.save(function (err) {
    if (err) {
      next(err);
      return;
    }
    res.redirect("/user/forum");
  });
});

forum.get('/api/user/forum', (req, res, next) =>{
	req.user.msg = req.body.message;
  req.user.save(function (err) {
    if (err) {
      next(err);
      return;
    }
    res.status(200).json(message);
   })
  });


module.exports = forum;
