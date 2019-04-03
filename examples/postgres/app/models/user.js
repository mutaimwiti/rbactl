module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING
  });

  User.associate = models => {
    User.belongsToMany(models.Role, {
      as: "roles",
      through: "RoleUser"
    });
  };

  User.prototype.getPermissions = async function f() {
    const roles = await this.getRoles();
    let permissions = [];
    roles.forEach(async role => {
      permissions = permissions.concat(role.permissions);
    });
    return permissions;
  };

  return User;
};
