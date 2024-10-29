function isVendor(req, res, next){

  if(!req.session.loggedInUser || req.session.loggedInUser.type !== 'vendor'){
    return res.status(403).send("Access denied.");
  }
  next();
}

module.exports = {
  isVendor
};
