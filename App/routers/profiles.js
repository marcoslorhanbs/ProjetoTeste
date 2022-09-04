const express = require('express');
const userControll = require('../controller/userControll');
const profile = express.Router();
const authentic = require('../controller/authenticate');
const authenticate = authentic;

profile.get('/user', authenticate , async (req, res, next) =>{
    const users = await userControll.getUsers(next);
    res.render('profiles', {users: users});
});


module.exports = profile;
