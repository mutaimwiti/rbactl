const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  roles: [{ type: Schema.Types.ObjectId, ref: "Role" }]
});

UserSchema.virtual("permissions").get(async function f() {
  const Role = mongoose.model("Role");

  const roles = await Role.find({ _id: { $in: this.roles.toObject() } });

  let permissions = [];

  roles.forEach(role => {
    permissions = permissions.concat(role.permissions);
  });

  return permissions;
});

module.exports = mongoose.model("User", UserSchema);
