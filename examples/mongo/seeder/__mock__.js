const bcrypt = require('bcrypt');

/* eslint-disable */

/*
Here the user permissions field is mocked. Ideally it should be resolved
from the roles of the user.
 */
const getRoles = () => [
  {
    name: "Super Admin",
    permissions: ["article.*", "role.*", "user.*"]
  },
  {
    name: "Role 2",
    permissions: ["article.view"]
  },
  {
    name: "Role 3",
    permissions: ["article.create"]
  },
  {
    name: "Role 4",
    permissions: []
  }
];

const getUsers = () => {
  const password = bcrypt.hashSync("password", 10);

  return [
    // admin
    {
      name: "Foo Bar",
      username: "foobar",
      email: "foobar@mail.com"
    },
    // simple user 1
    {
      name: "Bar Baz",
      username: "barbaz",
      email: "barbaz@mail.com"
    },
    // simple user 2
    {
      name: "John Doe",
      username: "johndoe",
      email: "johndoe@mail.com"
    },
    // simple user 3
    {
      name: "Jane Doe",
      username: "janedoe",
      email: "janedoe@mail.com"
    }
  ].map(user => {
    const newData = user;
    newData.password = password;
    return newData;
  });
};

const getArticles = users =>
  [
    {
      title: "Cooking",
      body: "This is how to cook"
    },
    {
      title: "Coding",
      body: "This is how to code"
    }
  ].map((user, i) => {
    return { ...user, owner: users[i]._id };
  });

const setUserRoles = async (users, roles) => {
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    user.roles = [roles[i]._id];
    await user.save();
  }
};

module.exports = {
  getRoles,
  getUsers,
  getArticles,
  setUserRoles
};
