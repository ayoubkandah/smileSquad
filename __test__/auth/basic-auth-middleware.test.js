'use strict';

require('@code-fellows/supergoose');
const middleware = require('../../src/auth/middleware/basic.js');
const Users = require('../../src/auth/models/users.js');

let users = {
  user_: { username: "user1", email:"user1@gmail.com" , imgUrl:"user1.png", password: "123" }
  ,
};

beforeAll(async (done) => {
  await new Users(users.user_).save();
  done();
});

describe('Auth Middleware', () => {
  const req = {};
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res),
  };
  const next = jest.fn();

  describe('user authentication', () => {
    it('fails a login for a user with the incorrect basic credentials', () => {
      req.headers = {
        authorization: 'Basic YWRtaW46Zm9v',
      };

      return middleware(req, res, next).then(() => {
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
      });
    });

    it('logs in an user user with the right credentials', () => {
      req.headers = {
        authorization: 'Basic dXNlcjE6MTIz',
      };

      return middleware(req, res, next).then(() => {
        expect(next).toHaveBeenCalledWith();
      });
    });
  });
});