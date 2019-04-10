const { validatePermissions } = require("./../utils");
const { Role } = require("../models");

module.exports = {
  list: (req, res) => {
    const roles = Role.all();
    return res.json({ roles });
  },

  get: (req, res) => {
    return res.json({ role: req.context.role });
  },

  create: (req, res) => {
    const { name, permissions } = req.body;
    if (name && permissions) {
      const { isValid, invalids } = validatePermissions(permissions);
      if (isValid) {
        const role = Role.create({
          ...req.body
        });
        return res.json({ role, message: "Role created successfully." });
      }
      return res
        .status(400)
        .json({ message: "You entered invalid permissions.", invalids });
    }
    return res
      .status(400)
      .json({ message: "name and permissions are required." });
  },

  update: (req, res) => {
    const { name, permissions } = req.body;
    if (name && permissions) {
      const { isValid, invalids } = validatePermissions(permissions);
      if (isValid) {
        const role = Role.update(req.context.role.id, { ...req.body });
        return res.json({ role, message: "Role updated successfully." });
      }
      return res
        .status(400)
        .json({ message: "You entered invalid permissions.", invalids });
    }
    return res
      .status(400)
      .json({ message: "name and permissions are required." });
  },

  delete: (req, res) => {
    const roleId = req.context.role.id;
    if (Role.getUsers(roleId).length) {
      return res.status(400).json({
        message:
          "The role cannot be deleted because there are users that belong to it."
      });
    }
    Role.delete(roleId);
    return res.json({ message: "Role deleted successfully." });
  }
};
