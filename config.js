/* codigo para verificar o login de usuario */
const passport = require('passport');
const User = require('./App/model/user');
const localStrategy = require('passport-local').Strategy;

module.exports = ()=>{
  passport.serializeUser((user, done)=>{
    done(null, user._id);
  });

  passport.deserializeUser((id, done)=>{
    User.findById(id, (err, user)=>{
      done(err, user);
    });
  });

  passport.use('login', new localStrategy((username, password, done)=>{
    User.findOne({username: username}, (err, user)=>{
      if(err){
        return done(err);
      }
      if(!user){
        return done(null, false, {message: 'User not found!'});
      }
      user.checkPassword(password, (err, isMatch) => {
        if(err){
          return done(err);
        }
        if(isMatch){
          return done(null, user);
        }
        else{
          return done(null, false, {message: 'Wrong Password!'});
        }
      });
    });
  }));

}