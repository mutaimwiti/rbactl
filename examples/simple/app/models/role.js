const { getRoles } = require("../__mock__");

let roleData = getRoles();

module.exports = {
  count: (roleIds = []) => {
    if (roleIds.length) {
      let count = 0;
      roleIds.forEach(roleId => {
        if (roleData.find(({ id }) => id === roleId)) {
          count += 1;
        }
      });
      return count;
    }

    return roleData.length;
  },

  all: () => roleData,

  find: roleId => {
    return roleData.find(role => role.id === roleId);
  },

  create: data => {
    const latestId = roleData[roleData.length - 1].id;
    const role = {
      id: latestId + 1,
      ...data
    };
    roleData.push(role);
    return role;
  },

  update: (roleId, data) => {
    let updatedRole = null;
    roleData = roleData.map(role => {
      if (role.id === roleId) {
        updatedRole = { ...role };
        Object.keys(data).forEach(key => {
          updatedRole[key] = data[key];
        });
        return updatedRole;
      }
      return role;
    });
    return updatedRole;
  },

  delete: roleId => {
    roleData = roleData.filter(article => article.id !== roleId);
  },

  /**
   * Register functions that rely on other models. This will be called
   * after a models are defined,
   *
   * @private
   */
  addRelationships: models => ({
    getUsers: roleId => {
      const roleUsers = [];

      models.User.all().forEach(user => {
        if (user.roles.indexOf(roleId) >= 0) {
          roleUsers.push(user);
        }
      });

      return roleUsers;
    }
  })
};
