'use strict';

const AdminBro = require('admin-bro');
const Admin = require('../model/admin.js');
const User = require('../../auth/models/users.js');
const { adminOption, userOption } = require('../options/option.js');
AdminBro.registerAdapter(require('@admin-bro/mongoose'));

const adminBro = new AdminBro({
  resources: [
    { resource: Admin, options: adminOption },
    { resource: User, options: userOption },
  ],
  rootPath: '/admin',
});

module.exports = adminBro;
