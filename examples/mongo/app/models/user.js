const mongoose = require('mongoose');
const { authorize } = require('../../../../lib');
const policies = require('../policies');

const { Schema } = mongoose;

const UserSchema = mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
});

UserSchema.virtual('permissions').get(async function f() {
  const Role = mongoose.model('Role');

  const roles = await Role.find({ _id: { $in: this.roles.toObject() } });

  let permissions = [];

  roles.forEach((role) => {
    permissions = permissions.concat(role.permissions);
  });

  return permissions;
});

/**
 * This method can be used to conveniently check whether the user can perform
 * a given action on an entity. This can prove useful if you still need to
 * perform an authorization check without necessary doing it at the
 * routing level.
 *
 * @param action
 * @param entity
 * @param req
 * @returns {Promise<boolean>}
 */
UserSchema.methods.can = async function f(action, entity, req = null) {
  return (
    authorize(action, entity, await this.permissions, policies, req) === true
  );
};

module.exports = mongoose.model('User', UserSchema);
