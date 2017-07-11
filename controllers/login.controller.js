/**
 * Services
 */
const jwtSign = require('../services/jwt-sign.service');

/**
 * Models
 */
const User = require('../models/user.model');

module.exports = function(req, res, next) {

  ///////////////////////////
  // req.body
  // {
  //    email: string
  //    password: string   
  // }
  ///////////////////////////
  
  let requestIp = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : '127.0.0.1';
  let email = req.body['email'];
  let password = req.body['password'];

  let validationErrors = [];

  User.findOne({email: email}, (err, user) => {
    if(err) {
      validationErrors.push('Unexpected error');
      return res.json({errors: validationErrors});
    }
    if(!user) {
      validationErrors.push('Invalid email or password.');
      return res.json({errors: validationErrors});
    }
    user.comparePasswords(password, user.password, (err, isMatch) => {
      if(err) {
        validationErrors.push('Unexpected error');
        return res.json({errors: validationErrors});
      }
      if(!isMatch) {
        validationErrors.push('Invalid email or password.');
        return res.json({errors: validationErrors});
      }
      jwtSign(user._id, requestIp, (err, token) => {
        if(err) {
          return next(err);
        }
        return res.json({token});
      });
    });
  });
}