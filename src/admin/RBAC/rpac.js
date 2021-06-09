'use strict';

const canEditUsers = ({ currentAdmin, record }) => {
  return (
    currentAdmin &&
    (currentAdmin.role === 'admin' ||
      currentAdmin._id == record.param('ownerId'))
  );
};

const canModifyAdmins = ({ currentAdmin }) => {
  return currentAdmin && currentAdmin.role === 'admin';
};

module.exports = {
  canEditUsers,
  canModifyAdmins,
};
