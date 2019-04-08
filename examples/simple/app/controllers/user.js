const { User, Role } = require("../models");

module.exports = {
  list: (req, res) => {
    const users = User.all();
    return res.json({ users });
  },

  get: (req, res) => {
    return res.json({ user: req.context.user });
  },

  setRoles: (req, res) => {
    const { roleIds } = req.body;

    const roleCount = Role.count(roleIds);

    if (!(roleCount === roleIds.length)) {
      return res.status(400).json({
        message: "One or more of the role ids you provided are invalid."
      });
    }

    const user = User.update(req.user.id, { ...req.user, roles: roleIds });

    return res.json({
      message: "Successfully updated user roles.",
      user
    });
  }
};
