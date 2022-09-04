const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;

const mongoose = require('../data/mongo');

const userSchema = mongoose.Schema({
  name:{
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
  },
  username: {type: String, required: true},
  blood: {type: String, required: true},
  age: {type: Number, default: 0},
  password: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  address:{
      city: String, 
      road: String,
      district: String,
      zip: String
  },
  createdAt:{type: Date, default: Date.now},
  msg: String
});

const noop = ()=>{};

userSchema.pre('save', async function save(next) {
  try {
   if (!this.isModified('password')) return next();

   const hash = await bcrypt.hash(this.password, 10);
   this.password = hash;
 
   return next();
  } catch (error) {
   return next(error);
  }
 });

userSchema.methods.checkPassword = function (guess, done) {
  bcrypt.compare(guess, this.password, function (err, isMatch) {
    done(err, isMatch);
  });
};


/*  userSchema.methods.validatePassword = async function validatePassword(data) {
  return bcrypt.compare(data, this.password);
}; */

const User = mongoose.model('Persons', userSchema);
module.exports = User;
