const mongoose = require('mongoose');

const RoleSchema = mongoose.Schema({
  name: { type: String, required: true },
  permissions: [{ type: String }],
});

RoleSchema.virtual('users').get(async function f() {
  const User = mongoose.model('User');

  return User.findOne({ roles: { $eq: this._id } });
});

module.exports = mongoose.model('Role', RoleSchema);
