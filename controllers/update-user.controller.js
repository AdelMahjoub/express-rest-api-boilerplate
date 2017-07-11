/**
 * Models
 */
const User = require('../models/user.model.js');

module.exports = function(req, res, next) {
  let userId = req.user['id'];
  let validationErrors = [];
  User.findById(userId, (err, user) => {
    if(!err && user) {
      Object.keys(req.body).forEach(key => {
        user[key] = req.body[key];
      });
      user.save((err, doc) => {
        if(err) {
          Object.keys(err.errors).forEach(key => {
            validationErrors.push(err.errors[key]['message'])
          });
          return res.json({errors: validationErrors});
        }
        User.findById(doc['_id'],{_id: 0, password: 0, __v: 0 }, (err, updatedUser) => {
          if(err || !updatedUser) {
            return res.json({errors: ['Unexpected error, please try again']});
          }
          return res.json({user: updatedUser});
        });
      });
    } else {
      return res.json({errors: ['Unexpected error, please try again.']});
    }
  });
}