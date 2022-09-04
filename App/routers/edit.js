const express = require("express");
const userControll = require('../controller/userControll');
const edit = express.Router();
const authentic = require('../controller/authenticate');
const authenticate = authentic;


edit.get('/edite', authenticate, (req, res) =>{
  res.render('edit');
});

edit.get('/users/:username', authenticate, async(req, res, next) =>{
  const userInfo = await userControll.getUserInfo(req.params.username, next);
  res.render('profile', userInfo);
});
 
edit.post('/edite', authenticate,(req, res, next)=>{
  userControll.update(req, next);
  req.flash('info', 'Upgrade sucess!');
  res.redirect('/tech');
});
  

module.exports = edit;