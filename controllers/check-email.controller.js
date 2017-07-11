/**
 * Models
 */
const User = require('../models/user.model');

module.exports = function(req, res, next) {
  let email = req.body['email'];
  User.findOne({email: email}, (err, user) => {
    if(!err) {
      return res.json({emailIsUsed: Boolean(user)});
    }
    return res.json({emailIsUsed: false});
  });
}