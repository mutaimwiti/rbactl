const { env } = require("./config/config");
const { connect } = require("./config/database");
const { User, Role, Article } = require("./models");
const { getRoles, getUsers, getArticles, setUserRoles } = require("./__mock__");

const seed = async () => {
  /* eslint-disable*/
  if (env === "development") {
    console.log("=============== Clearing database ===============");
    await Role.deleteMany();
    await User.deleteMany();
    await Article.deleteMany();
    console.log("============= Cleared successfully ==============");
    console.log("================ Seeding database ===============");
    const roles = await Role.insertMany(getRoles());
    const users = await User.insertMany(getUsers());
    await Article.insertMany(getArticles(users));
    await setUserRoles(users, roles);
    console.log("============== Seeded successfully ==============");
    process.exit(0);
  } else {
    console.log("Can only seed in development!");
    process.exit(1);
  }
};

connect(async () => {
  await seed();
});
