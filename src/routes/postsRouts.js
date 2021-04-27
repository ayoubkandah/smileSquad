'use strict';

const express = require('express');
const router = express.Router();
const superagent = require('superagent');
const Model = require('../auth/models/users.js');
const bearerAuth = require('../auth/middleware/bearer.js');
const permissions = require('../auth/middleware/acl.js');


const Post = require('../auth/models/posts')


router.post('/api/v1/players/:id/addPost', bearerAuth, addPostHandler);
router.post('/api/v1/players/:id/removePost', bearerAuth, removePostHandler);
router.post('/api/v1/players/:id/updatePost', bearerAuth, updatePostHandler);
router.get('/api/v1/players/:id/posts', bearerAuth, getAllPostsHandler);

async function addPostHandler(req, res, next) {
    try {
        const userpost = req.body;
        const newPost = await new Post(userpost);
        newPost.username = req.user.username
        req.user.posts.push(newPost)
        newPost.save();
        req.user.save();
        // console.log(req.user.posts);
        res.status(200).json(req.user.posts)
    } catch (e) {
        next(e.message);
    }
}

async function removePostHandler(req, res, next) {
    try {
        //post 
        const id = req.params.id;
        const users = await Model.find({});

        let player = users.filter(player => {
            if(player.username == req.user.username) return true;
        })

        let idx = 0;
        for (let i = 0; i < req.user.posts.length; i++) {
            let idPost= player[0].posts[i];
           
            if (idPost._id == id) {
                const playerPosts = await Post.findByIdAndDelete(id);
                // playerPosts.save();
                
           let r =  player[0].posts.map((element, index) => {                    
                    if (element._id.toString() == id.toString()) {
                        idx = index;
                        player[0].posts.splice(idx, 1);
                    }
                });
                player[0].save();
            }
        }
        res.status(200).json(player[0].posts);
    } catch (e) {
        next(e.message);
    }
}

async function updatePostHandler(req, res, next) {
    try {
        //post 
        const id = req.params.id;
        const record = req.body;
        const users = await Model.find({});

        let player = users.filter(player => {
            if(player.username == req.user.username) return true;
        })

        const users1 = await Post.findByIdAndUpdate(id, record, { new: true });

        let r = player[0].posts.map((element, index) => {                    
            if (element._id.toString() == id.toString()) {
                player[0].posts[index] = users1;
                console.log('users1' , users1);
            }
        });

        console.log('req.user.posts[index]' , player[0].posts[0]);
        await player[0].save();

        console.log('req.user.posts[index]2' ,player[0].posts[0]);
        
        res.status(200).json(player[0]);
    } catch (e) {
        next(e.message);
    }
}

async function getAllPostsHandler(req, res, next) {
    console.log('user1');

    try {
        console.log('user2');

        const posts = await Post.find({});
        const list = posts.map(user => {
            console.log(user);

            return ({
                name: user.username,
                title: user.title,
                content: user.content
            });
        });
        res.status(200).json(list);
      } catch (e) {
        next(e.message);
      }
}
module.exports = router;
