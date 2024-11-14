function generate_csrf_token(req) {
  if (req.session.csrf_token &&  req.session.csrf_token.expired_date > Date.now()) {
    return req.session.csrf_token.value;
  } 

  var token = Math.random().toString(36).substring(2);

  req.session.csrf_token = {
    value: token,
    expired_date: Date.now() + 3600000 * 3, // 3 ore
  };

  return token;
}

function validate_csrf_token(req, token) {
  return req.session.csrf_token && req.session.csrf_token.value === token;
}

module.exports = {
  generate_csrf_token: generate_csrf_token,
  validate_csrf_token: validate_csrf_token
};