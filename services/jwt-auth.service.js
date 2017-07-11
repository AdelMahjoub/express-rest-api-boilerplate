/**
 * Node modules
 */
const expressJwt = require('express-jwt');   // https://github.com/auth0/express-jwt

module.exports = expressJwt({
  secret: process.env.PUBLIC_KEY,
  credentialsRequired: true,
  getToken: function fromHeader(req, res, next) {
    if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  },
  isRevoked: function(req, payload, done) {
    let aud = payload['aud'];
    let iss = payload['iss'];
    let requestIp = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : '127.0.0.1';
    if(aud !== requestIp) {
      return done('audience mis-match');
    }
    if(iss !== process.env.ISSUER) {
      return done('issuer mis-match')
    }
    return done();
  }
})
.unless({
  path: [
    '/',
    '/api/login',
    '/api/signup',
    '/api/email-is-used',
    '/api/report-violation',
  ]
})
