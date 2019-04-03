const appendTimestamps = data => {
  return data.map(item => ({
    ...item,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
};

const getRoles = () =>
  appendTimestamps([
    {
      name: "Super Admin",
      permissions: ["article.*"]
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
      permissions: "{}"
    }
  ]);

const getUsers = () =>
  appendTimestamps([
    {
      name: "Foo Bar",
      username: "foobar",
      email: "foobar@mail.com",
      password: "password"
    },
    {
      name: "Bar Baz",
      username: "barbaz",
      email: "barbaz@mail.com",
      password: "password"
    },
    {
      name: "Jane Doe",
      username: "janedoe",
      email: "janedoe@mail.com",
      password: "password"
    },
    {
      name: "John Doe",
      username: "johndoe",
      email: "johndoe@mail.com",
      password: "password"
    }
  ]);

const getArticles = users =>
  appendTimestamps([
    {
      title: "My article",
      body: "This is me writing",
      ownerId: users[0].id
    },
    {
      title: "My article no 2",
      body: "This is me writing again",
      ownerId: users[1].id
    }
  ]);

const getRoleUser = (roles, users) =>
  appendTimestamps([
    {
      RoleId: roles[0].id,
      UserId: users[0].id
    },
    {
      RoleId: roles[1].id,
      UserId: users[1].id
    },
    {
      RoleId: roles[2].id,
      UserId: users[2].id
    },
    {
      RoleId: roles[3].id,
      UserId: users[3].id
    }
  ]);

module.exports = {
  getRoles,
  getUsers,
  getArticles,
  getRoleUser
};
