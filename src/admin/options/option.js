'use strict';

const bcrypt = require('bcrypt');
const { canEditUsers, canModifyAdmins } = require('../RBAC/rpac.js');

const adminOptions = {
  properties: {
    encryptedPassword: { isVisible: false },
    password: {
      type: 'string',
      isVisible: {
        list: false,
        edit: true,
        filter: false,
        show: false,
      },
    },
  },
  actions: {
    new: {
      before: async (request) => {
        if (request.payload.password) {
          request.payload = {
            ...request.payload,
            encryptedPassword: await bcrypt.hash(request.payload.password, 10),
            password: undefined,
          };
        }
        return request;
      },
    },
    edit: { isAccessible: canModifyAdmins },
    delete: { isAccessible: canModifyAdmins },
    new: { isAccessible: canModifyAdmins },
  },
};

const userOption = {
  properties: {
    ownerId: {
      isVisible: { edit: false, show: true, list: true, filter: true },
    },
  },
  actions: {
    edit: { isAccessible: canEditUsers },
    delete: { isAccessible: canEditUsers },
    new: {
      before: async (request, { currentAdmin }) => {
        request.payload = {
          ...request.payload,
          ownerId: currentAdmin._id,
        };
        return request;
      },
    },
  },
};
module.exports = { adminOptions, userOption };
