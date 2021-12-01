const User = require('../users/users-model');

function logger(req, res, next) {
  const reqMethod = req.method;
  const reqUrl = req.originalUrl;
  const timestamp = new Date().toLocaleString();

  console.log(`${reqMethod} ${reqUrl} ${timestamp}`);
  next();
}

async function validateUserId(req, res, next) {
  const { id } = req.params;
  const user = await User.getById(id);
  try {
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(404).json({ message: 'user not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'error validating user id' });
  }
}

function validateUser(req, res, next) {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ message: 'missing required name field' });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  const { text } = req.body;
  if (!text) {
    res.status(400).json({ message: 'missing required text field' });
  } else {
    next();
  }
}

module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
};
