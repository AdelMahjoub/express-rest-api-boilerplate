/**
 * Node Modules
 */
const validator = require('validator');     // https://github.com/chriso/validator.js
const bcrypt    = require('bcrypt-nodejs'); // https://www.npmjs.com/package/bcrypt
const shortId   = require('shortid');       // https://www.npmjs.com/package/shortid

// DB instance
const db = require('../services/db.service');

const UserSchema = db.Schema({
  username: {
    type: String,
    default: `user-${shortId.generate()}`,
    unique: 'This username is not available.',
    required: 'Username should not be empty.',
    validate: [
      {
        validator: function(value) {
          return value.length >= 4;
        },
        msg: 'Username minimum length: 4 characters.'
      },
      {
        isAsync: true,
        validator: function(value, respond) {
          if(!this.isModified('username')) {
            respond(true);
          }
          User.findOne({username: value}, (err, user) => {
            if(err) {
              console.log('Unexpected error while validating username: ' + err);
              respond(false);
            }
            respond(!Boolean(user));
          });
        },
        msg: 'This username is already used.'
      }
    ]
  },
  firstName: {
    type: String,
    validate: {
      validator: function(value) {
        return validator.isAlpha(value);
      },
      msg: 'The firstname should not contain numbers or contain special characters.'
    }
  },
  lastName: {
    type: String,
    validate: {
      validator: function(value) {
        return validator.isAlpha(value);
      },
      msg: 'The lastname should not contain numbers or special characters.'
    }
  },
  age: {
    type: String,
    validate: [
      {
        validator: function(value) {
          return validator.isNumeric(value);
        },
        msg: 'The age should be a number.'
      },
      {
        validator: function(value) {
          return (parseInt(value, 10) >= 18 && parseInt(value, 10) <= 200);
        },
        msg: 'The age must be between 18 and 200.'
      }
    ]
  },
  location: {
    type: String
  },
  phone: {
    type: String,
    validate: {
      validator: function(value) {
        return validator.isNumeric(value);
      },
      msg: 'The phone number should only contain numbers, replace + by 00 if it is the case.'
    }
  },
  email: {
    type: String,
    unique: 'This email is already registred.',
    required: 'The email should not be empty.',
    validate: [
      {
        validator: function(value) {
          return validator.isEmail(value);
        },
        msg: 'Invalid email address.'
      },
      {
        isAsync: true,
        validator: function(value, respond) {
          if(!this.isModified('email')) {
            respond(true);
          }
          User.findOne({email: value}, (err, user) => {
            if(err) {
              console.log('Unexpected error while validating email: ' + err);
              respond(false);
            }
            respond(!Boolean(user));
          });
        },
        msg: 'Email already registred.'
      }
    ]
  },
  password: {
    type: String,
    requires: 'The Password should not be empty.',
    validate: {
      validator: function(value) {
        return value.length >= 6;
      },
      msg: 'The Password should have at least 6 characters.'
    }
  },
  games: []
});

// Schema pre save middleware on User

// Bcrypt User password
UserSchema.pre('save', function(next) {
  let user = this;
  if(!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    if(err) return next();
    bcrypt.hash(user.password, salt, ()=>{}, function(err, hashed) {
      if(err) return next();
      user.password = hashed;
      return next();
    });
  });
});

// Schema compare password method
UserSchema.methods.comparePasswords = function(guess, password, callback) {
  bcrypt.compare(guess, password, function(err, isMatch) {
    return callback(err, isMatch);
  });
}

// User model 
const User = db.model('User', UserSchema);

module.exports = User;