const { getUsers } = require("../__mock__");

let userData = getUsers();

module.exports = {
  all: () =>
    userData.map(user => {
      const data = user;
      delete data.password;
      return data;
    }),

  find: userId => {
    return userData.find(user => user.id === userId);
  },

  findByUsername: username => {
    return userData.find(user => user.username === username);
  },

  create: data => {
    const latestId = userData[userData.length - 1].id;
    const user = {
      id: latestId + 1,
      ...data
    };
    userData.push(user);
    return user;
  },

  update: (userId, data) => {
    let updatedUser = null;
    userData = userData.map(user => {
      if (user.id === userId) {
        updatedUser = { ...user };
        Object.keys(data).forEach(key => {
          updatedUser[key] = data[key];
        });
        return updatedUser;
      }
      return user;
    });
    return updatedUser;
  },

  /**
   * Register functions that rely on other models. This will be called
   * after a models are defined,
   *
   * @private
   */
  addRelationships: models => ({
    getPermissions: userId => {
      const user = userData.find(({ id }) => id === userId);
      let permissions = [];
      user.roles.forEach(id => {
        permissions = permissions.concat(models.Role.find(id).permissions);
      });
      return permissions;
    }
  })
};
