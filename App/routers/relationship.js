const express = require("express");
const userControll = require("../controller/userControll");
const relationships = express.Router();

relationships.get(
  "/users/:username1/donate/:username2",
  async (req, res, next) => {
    const createdonate = await userControll.createDonate(
      req.params.username1,
      req.params.username2,
      next
    );
    if (createdonate) {
      return res.redirect("/user");
    } else {
      req.flash("error", "tente novamente mais tarde");
      return res.redirect("/user");
    }
  }
);

module.exports = relationships;
