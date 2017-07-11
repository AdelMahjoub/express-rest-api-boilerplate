/**
 * Node Modules
 */
const express = require('express');

/**
 * Initialize
 */
const router = express.Router();

/**
 * Controllers
 */
const login          = require('../controllers/login.controller');
const signup         = require('../controllers/signup.controller');
const emailIsUsed    = require('../controllers/check-email.controller');
const usernameIsUsed = require('../controllers/check-username.controller');
const authUser       = require('../controllers/get-auth-user.controller');
const updateUser     = require('../controllers/update-user.controller');

/**
 * CSP violation reports
 */
router.use('/api/report-violation', (req, res, next) => {
  let cspReport = JSON.stringify(req.body) + '\n';
  fs.appendFile(path.join(__dirname, 'logs', 'csp-reports.log'), cspReport, 'utf8', (err) => {
    return next();
  });
});

/**
 * Endpoints
 */
router.get('/api',(req, res, next) => {
  console.log(req.user);
  res.json({status: 'ok'});
});

/**
 * Signup
 */
router.post('/api/signup', signup);

/**
 * Login
 */
router.post('/api/login', login);

/**
 * Email async validator
 * Check if a given email is already registred
 */
router.post('/api/email-is-used', emailIsUsed);

/**
 * Username async validator
 * Check if a given username is already registred
 */
router.post('/api/username-is-used', usernameIsUsed);

/**
 * Get authenticated user
 */
router.get('/api/get-auth-user', authUser);

/**
 * Update user
 */
router.post('/api/update-user', updateUser);

/**
 * Check jwt token
 * Used for SPA authGuard
 * This route is protected and can only be accessed if Authorization header is set && the token is valid
 * If this endpoint is accessed then the user is authenticated and authorized to query ressources 
 */
router.get('/api/verify-token', (req, res, next) => {
  res.json({errors: []});
});


module.exports = router;