const bcrypt = require("bcrypt");
/*
Here the user permissions field is mocked. Ideally it should be resolved
from the roles of the user.
 */
module.exports = {
  getRoles: () => [
    {
      id: 1,
      name: "Super Admin",
      permissions: ["article.*", "role.*", "user.*"]
    },
    {
      id: 2,
      name: "Role 2",
      permissions: ["article.view"]
    },
    {
      id: 3,
      name: "Role 3",
      permissions: ["article.create"]
    },
    {
      id: 4,
      name: "Role 4",
      permissions: []
    }
  ],

  getUsers: () => {
    const password = bcrypt.hashSync("password", 10);

    return [
      // admin
      {
        id: 1,
        name: "Foo Bar",
        username: "foobar",
        roles: [1]
      },
      // simple user 1
      {
        id: 2,
        name: "Bar Baz",
        username: "barbaz",
        roles: [2]
      },
      // simple user 2
      {
        id: 3,
        name: "John Doe",
        username: "johndoe",
        roles: [3]
      },
      // simple user 3
      {
        id: 4,
        name: "Jane Doe",
        username: "janedoe",
        roles: [4]
      }
    ].map(user => {
      const newData = user;
      newData.password = password;
      return newData;
    });
  },

  getArticles: () => [
    {
      id: 1,
      title: "Cooking",
      body: "This is how to cook",
      ownerId: 1
    },
    {
      id: 2,
      title: "Coding",
      body: "This is how to code",
      ownerId: 2
    }
  ]
};
