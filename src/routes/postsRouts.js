'use strict';

const express = require('express');
const router = express.Router();
const users = require('../models/data-collection.js');
const bearerAuth = require('../auth/middleware/bearer.js');

const Post = require('../auth/models/posts');

router.post('/addPost', bearerAuth, addPostHandler);
router.delete('/removePost/:id', bearerAuth, removePostHandler);
router.put('/updatePost', bearerAuth, updatePostHandler);
router.get('/posts/:id', bearerAuth, getAllPostsHandler);

// post req.body = {userId, title, content}

async function addPostHandler(req, res, next) {
  try {
    let userPost = await users.addPost({ ...req.body });
    res.status(200).json(userPost);
  } catch (e) {
    next(e.message);
  }
}

async function removePostHandler(req, res, next) {
  try {
    let id = req.params.id;
    let post = await users.postDelete(id);
    res.status(200).json(post);
  } catch (e) {
    next(e.message);
  }
}

// req.body = {postId, title, content};
async function updatePostHandler(req, res, next) {
  try {
    let post = await users.postUpdate({ ...req.body });
    res.status(200).json(post);
  } catch (e) {
    next(e.message);
  }
}

async function getAllPostsHandler(req, res, next) {
  try {
    let postArray = await users.friendsPosts(req.params.id);
    res.status(200).json(postArray);
  } catch (e) {
    next(e.message);
  }
}
module.exports = router;
