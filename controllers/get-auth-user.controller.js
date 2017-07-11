/**
 * Models
 */
const User = require('../models/user.model');

module.exports = function(req, res, next) {
  let userId = req.user['id'];
  User.findById(userId, {_id: 0, password: 0, __v: 0} , (err, user) => {
    if(!err && user) {
      return res.json({user})
    }
    return res.json({user: null})  
  });
}