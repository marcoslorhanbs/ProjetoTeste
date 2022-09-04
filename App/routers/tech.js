const express = require('express');
const tech = express.Router();
const authentic = require('../controller/authenticate');

const  authenticate = authentic;

tech.get('/tech', authenticate , (req, res, next) =>{
  res.render('tech');
});


module.exports =  tech;