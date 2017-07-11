/**
 * Models
 */
const User = require('../models/user.model');

module.exports = function(req, res, next) {
  let username = req.body['username'];
  User.findOne({username: username}, (err, user) => {
    return res.json({usernameIsUsed: Boolean(user)});
  });
}