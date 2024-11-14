const validate_csrf_token = require('../helpers/helper').validate_csrf_token;

function check_csrf_token(req, res, next) {
  csrf_valid_token_methods = ['POST', 'PUT', 'PATCH', 'DELETE'];

  if (csrf_valid_token_methods.includes(req.method)) {
    if (!validate_csrf_token(req, req.body.csrf_token)) {
      return res.status(403).send('Invalid CSRF token');
    }
  }

  next();
}

module.exports = {
  check_csrf_token
};