module.exports = {
  users: [
    // admin
    {
      id: 1,
      name: "Super Admin",
      permissions: ["article.*"]
    },
    // simple user 1
    {
      id: 2,
      name: "Foo Bar",
      permissions: ["article.view"]
    },
    // simple user 2
    {
      id: 3,
      name: "John Doe",
      permissions: ["article.create"]
    },
    // simple user 3
    {
      id: 4,
      name: "Jane Doe",
      permissions: []
    }
  ],

  articles: [
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
