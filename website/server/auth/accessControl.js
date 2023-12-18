const AccessControl = require('accesscontrol')
const ac = new AccessControl();

exports.roles = (function() {
    ac.grant('user')
    .createOwn('profile')
    .createOwn('booking')
    .deleteOwn('booking')
    .updateOwn('booking')
    .readOwn('booking')
    .deleteOwn('profile')
    .readOwn('profile)')
    .updateOwn('profile')
  .grant('admin')
    .extend('user')
    .updateAny('profile')
    .deleteAny('profile')
    .readAny('profile')
    .readAny('booking')
    .deleteAny('booking')
    .updateAny('booking')
    return ac;
})()
