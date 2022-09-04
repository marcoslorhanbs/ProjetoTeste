const express = require('express');
const index = express.Router();

index.get('/', function (req, res, next) {
  res.render('index');
});

module.exports =  index;