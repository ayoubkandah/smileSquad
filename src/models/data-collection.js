'use strict';

const UserModel = require('../auth/models/users.js');
const ReportModel = require('../auth/models/Report.js');
const PostModel = require('../auth/models/Post.js');

class DataCollection {
  constructor(model, reportModel, postModel) {
    this.model = model;
    this.reportModel = reportModel;
    this.postModel = postModel;
  }
  async addUser({ username, email, password, imgUrl, role }) {
    try {
      let data = removeEmpty({ username, email, password, imgUrl, role });
      let user = new this.model(data);
      let userData = await user.save();
      return { ...userData._doc, token: userData.token };
    } catch (error) {
      console.log('__addUser__', error.message);
    }
  }
  search(username) {
    let users = this.model.find({ username });
    return users;
  }
  async getUsers() {
    let users = await this.model.find({});
    return users;
  }
  async getUserById(id) {
    let user = await this.model.findById(id);
    return user;
  }
  async userUpdate({ id, username, email, imgUrl }) {
    let userData = removeEmpty({ username, email, imgUrl });
    let updatedUser = this.model.findByIdAndUpdate(
      { _id: id },
      { ...userData }
    );
    return updatedUser;
  }
  async userDelete(id) {
    let user = this.model.findByIdAndDelete({ _id: id });
    return user;
  }
  async addUserFriend({ userId, friendId }) {
    let user = await this.model.findById(userId);
    let friend = await this.model.findById(friendId);
    await user.friendList.push(friendId);
    await friend.friendList.push(userId);
    let newUser = await user.save();
    let newFriend = await friend.save();
    return [newUser, newFriend];
  }
  async getFriends(id) {
    let user = await this.model.findById(id).populate('friendList');
    return user.friendList;
  }
  async removeUserFriend({ userId, friendId }) {
    let user = await this.model.findById(userId);
    let friend = await this.model.findById(friendId);
    user.friendList = user.friendList.filter(
      (friendsId) => friendsId != friendId
    );
    friend.friendList = friend.friendList.filter(
      (friendsId) => friendsId != userId
    );
    let newUser = await user.save();
    let newFriend = await friend.save();
    return [newUser, newFriend];
  }
  async addReprot({ user, message }) {
    let report = new this.reportModel({ user: user, message: message });
    report = await report.save();
    let userReported = await this.model.findById(user);
    await userReported.reports.push(report._id);
    userReported = await userReported.save();
    return report;
  }
  async addPost({ userId, title, content }) {
    let post = new this.postModel({ user: userId, title, content });
    post = await post.save();
    let user = await this.model.findById(userId);
    await user.posts.push(post._id);
    user = await user.save();
    let popultedPost = await this.postModel.findById(post._id).populate('user');
    return popultedPost;
  }
  async postUpdate({ postId, title, content }) {
    let postData = removeEmpty({ title, content });
    let post = this.postModel
      .findByIdAndUpdate({ _id: postId }, { ...postData })
      .populate('user');

    return post;
  }
  async postDelete(id) {
    let post = this.postModel.findByIdAndDelete(id).populate('user');
    return post;
  }
  async friendsPosts(id) {
    let user = await this.model.findById(id).populate('friendList', 'posts');
    let arr = [];
    user.friendList.forEach((friend) => {
      friend.posts.forEach((post) => {
        let friendPost = this.postModel.findById(post).populate('user');
        arr.push(friendPost);
      });
    });
    return arr;
  }
}
function removeEmpty(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}

module.exports = new DataCollection(UserModel, ReportModel, PostModel);
