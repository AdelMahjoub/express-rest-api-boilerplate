/**
 * Node Modules
 */
const express     = require('express');       // http://expressjs.com/
const bodyParser  = require('body-parser');   // https://github.com/expressjs/body-parser
const helmet      = require('helmet');        // https://github.com/helmetjs/helmet
const jwt         = require('jsonwebtoken');  // https://github.com/auth0/node-jsonwebtoken
const logger      = require('morgan');        // https://github.com/expressjs/morgan
const compression = require('compression');   // https://github.com/expressjs/compression
const path        = require('path');          // https://nodejs.org/api/path.html
const fs          = require('fs');            // https://nodejs.org/dist/latest-v6.x/docs/api/fs.html

/**
 * Initialize
 */
const app = express();

/**
 * Services
 */
const jwtAuth = require('./services/jwt-auth.service');

/**
 * Import routes
 */
const routes = require('./routes/router');

/**
 * Setup server port
 */
app.set('port', process.env.PORT || 3000);

/**
 * Security policy
 */
app.use(helmet(require('./security.policy')));
app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));
app.use(helmet.hidePoweredBy({ setTo: 'PHP 7.0' }));

/**
 * Compression
 */
app.use(compression());

/**
 * HTTP request logger
 */
let accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs', 'access.log'), {flags: 'a'});
app.use(logger('common', {stream: accessLogStream}));

/**
 * Static files
 */
app.use(express.static(path.join(__dirname, 'dist')));

/**
 * Parse request body
 */
app.use(bodyParser.json({
  type: ['json', 'application/csp-report']
}));

/**
 * Authorization policy
 */
app.use(jwtAuth, (err, req, res, next) => {
  if(err) {
    return next(err);
  }
  return next();
});

/**
 * Api endpoints
 */
app.use(routes);

/**
 * Case Unauthorized
 */
app.use((err, req, res, next) => {
  res.json({errors: ['Unauthorized']});  
});

/**
 * Server
 */
app.listen(app.get('port'), () => {
  console.log(`Server running on port ${app.get('port')}`);
  console.log(`Mode: ${process.env.NODE_ENV}`);
});