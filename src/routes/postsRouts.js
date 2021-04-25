'use strict';

const express = require('express');
const router = express.Router();
const superagent = require('superagent');
const Model = require('../auth/models/users.js');
const bearerAuth = require('../auth/middleware/bearer.js');
const permissions = require('../auth/middleware/acl.js');

const Post = require('../auth/models/posts')


router.post('/api/v1/players/:id/addPost', bearerAuth, addPostHandler);
// router.post('/api/v1/players/:id/removePost', bearerAuth, removePostHandler);
// router.get('/api/v1/players/posts', bearerAuth, getAllPostsHandler);

async function addPostHandler(req, res, next) {
    try {
        const userpost = req.body;
        const newPost = await new Post(userpost);
        newPost.username = req.user.username
        req.user.posts.push(newPost)
        newPost.save();
        req.user.save();
        console.log(req.user.posts);
        res.status(200).json(req.user.posts)
    } catch (e) {
        next(e.message);
    }
}

// async function removePostHandler(req, res, next){
//     try {
//         const id = req.params.id;
//         const posts = await Post.findByIdAndDelete(id);
//         res.status(200).json(posts);
//       } catch (e) {
//         next(e.message);
//       }
// }

// async function getAllPostsHandler(req, res, next){
//     try {
//         const posts = await Post.find({});
//         const list = users.filter(user => {
//           if (user.role == 'user')
//             return true
//         });
//         res.status(200).json(posts);
//       } catch (e) {
//         next(e.message);
//       }
// }
module.exports = router;
