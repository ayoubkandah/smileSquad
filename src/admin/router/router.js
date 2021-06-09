'use strict';

const adminBro = require('../adminbro/adminBro.js');
const AdminBroExpressjs = require('@admin-bro/express');
const Admin = require('../model/admin.js');
const bcrypt = require('bcrypt');

const router = AdminBroExpressjs.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    const user = await Admin.findOne({ email });
    if (user) {
      const matched = await bcrypt.compare(password, user.encryptedPassword);
      if (matched) {
        return user;
      }
    }
    return false;
  },
  cookiePassword: 'smile-squad-alpha-version',
});

module.exports = router;
