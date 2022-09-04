const { json } = require('body-parser');
const { error } = require('express-openapi-validator');
const passport = require('passport/lib');
const User = require('../model/user');
const neo4j = require('../data/neo4j');

//apiLogin post('/api/login')
const apiLogin = (req, res)=>{
  passport.authenticate('login',{
    successRedirect: res.status(200).json('sucess'),
    failureRedirect: res.status(400).json('error')
  })
}

//apiUserUsername get('/api/user/:username')
const apiUserUsername =  async(req, res, next)=>{
  const pessoa = await User.find({username: req.params.username});
  if(pessoa.length > 0){
      res.status(200).send(pessoa)
  }else{
      res.status(400).json('Usuario nao encontrada');
 }
}

//delet.post('/api/delete/:email)
const apiDelete =  (req, res, next) =>{
  const email = req.params.email;
  User.deleteOne({ email : email}, (err, user)=>{
    if(err){
      return next(err);
    } 
    if(!user){
      return next(404);
    }
    res.status(200).json('deu certo');
  });
}

//delet.post('/api/delete/:_id')
const apiDeleteId = (req, res, next) =>{
  const id = req.params._id;
  User.deleteOne({ id : id}, (err, user) =>{
    if(err){
      return next(err);
    } 
    if(!user){
      return next(404);
    }
    res.status(200).json('deu certo');
  });
}

//edit.post('/api/edite')
const apiEdite =  async (req, res) =>{
  const email = req.body.email;
  const age = req.body.age;
  const username = req.body.username;
  const address = {
    city : req.body.city,
    road : req.body.road,
    district : req.body.district,
    zip : req.body.zip
  }
  const result =  await User.updateOne({email: email}, 
    {$set:{username:username, age:age, address:address }}, {upsert:true});
    if(result.modifiedCount > 0){
      res.status(200).json();
    }
    res.status(400).json();
}

 //forum.post('/api/forum')
 const apiForum =  (req, res, next) => {
  req.body.msg = req.body.message;
  req.body.save( (err) => {
    if (err) {
      next(err);
      return;
    }
    res.status(200).json(message);
  });
}

//profile.get('/api/user')
const listUser = (req, res, next)=>{
  User.find().sort({createdAt: 'descending'}).exec((err, users)=>{
    if (err){
      return next(err);
    }
    res.status(200).send(users);
  });
};

//register.post('/api/register') 
const apiRegister = (req, res, next) =>{
  const name = {
    firstName : req.body.firstName,
    lastName : req.body.lastName,
  }; 
  const age = req.body.age;
  const username = req.body.username;
  const blood = req.body.blood;
  const email = req.body.email;
  const password = req.body.password;
  const address = {
    city : req.body.city,
    road : req.body.road,
    district : req.body.district,
    zip : req.body.zip
  };
  
  User.findOne({email: email}, (err, user)=>{
    if (err){
      return next(err);
    }
    if(user){
      return res.status(401).json(user);
    }

    const newUser = new User({
      name : name,
      username: username,
      blood: blood,
      age : age,
      email: email,
      password : password,
      address : address,
    });
    newUser.save(next);
    return res.json(newUser);
  }); 
}

const createDonate = async (user1, user2, errCalback) => {
  try {
    const session = neo4j.session();
    const result = await session.run(
      `MATCH (p1:Pessoa{username:"${user1}"})` +
        `OPTIONAL MATCH (p2:Pessoa{username:"${user2}"})` +
        ` CREATE (p1)-[:DOOU {date:date()}]->(p2) ` +
        `RETURN p2`
    );
    await session.close();
    if (result.summary.counters._stats.relationshipsCreated > 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    errCalback(err);
  }
};

const createRelacionament = async (req, res, next) => {
  const createdonate = await createDonate(
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

module.exports = {apiDelete, apiDeleteId, apiEdite, 
  apiLogin, apiForum, apiUserUsername, 
  listUser, apiRegister, createRelacionament}