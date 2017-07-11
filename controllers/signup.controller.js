/**
 * Models
 */
const User = require('../models/user.model.js');

module.exports = function(req, res, next) {
  
  ///////////////////////////
  // req.body
  // {
  //    email: string
  //    password: string   
  // }
  ///////////////////////////
  
  let validationErrors = [];
  
  let newUser = new User({
    email: req.body['email'],
    password: req.body['password']
  });

  User.create(newUser, (err, user) => {
    if(err) {
      Object.keys(err.errors).forEach(key => {
        validationErrors.push(err.errors[key]['message'])
      });
    }
    return res.json({errors: validationErrors});
  });
}