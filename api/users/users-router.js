const express = require('express');

const User = require('./users-model');
const Post = require('../posts/posts-model');

const {
  validateUserId,
  validateUser,
  validatePost,
} = require('../middleware/middleware');

const router = express.Router();

router.get('/', (req, res, next) => {
  User.get()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/:id', validateUserId, (req, res) => {
  res.json(req.user);
});

router.post('/', validateUser, (req, res, next) => {
  User.insert(req.body)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch(next);
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  const { id } = req.params;
  const changes = req.body;
  User.update(id, changes)
    .then((user) => {
      res.json(user);
    })
    .catch(next);
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  try {
    await User.remove(req.params.id);
    res.json(req.user);
  } catch (err) {
    next(err);
  }
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  try {
    const posts = await User.getUserPosts(req.params.id);
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/:id/posts',
  validateUserId,
  validatePost,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const post = await Post.insert({
        user_id: id,
        ...req.body,
      });
      res.status(201).json(post);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
