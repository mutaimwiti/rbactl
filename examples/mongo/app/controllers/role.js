const { validatePermissions } = require('./../utils');
const { Role } = require('../models');

module.exports = {
  list: async (req, res) => {
    const roles = await Role.find({});
    return res.json({ roles });
  },

  get: (req, res) => {
    return res.json({ role: req.context.role });
  },

  create: async (req, res) => {
    const { name, permissions } = req.body;
    if (name && permissions) {
      const { isValid, invalids } = validatePermissions(permissions);
      if (isValid) {
        const role = await Role.create({
          ...req.body,
        });
        return res.json({ role, message: 'Role created successfully.' });
      }
      return res
        .status(400)
        .json({ message: 'You entered invalid permissions.', invalids });
    }
    return res
      .status(400)
      .json({ message: 'name and permissions are required.' });
  },

  update: async (req, res) => {
    const { name, permissions } = req.body;
    if (name && permissions) {
      const { isValid, invalids } = validatePermissions(permissions);
      if (isValid) {
        const { role } = req.context;
        role.name = name;
        role.permissions = permissions;
        await role.save();
        return res.json({ role, message: 'Role updated successfully.' });
      }
      return res
        .status(400)
        .json({ message: 'You entered invalid permissions.', invalids });
    }
    return res
      .status(400)
      .json({ message: 'name and permissions are required.' });
  },

  delete: async (req, res) => {
    if (await req.context.role.users) {
      return res.status(400).json({
        message:
          'The role cannot be deleted because there are users that belong to it.',
      });
    }
    await req.context.role.delete();
    return res.json({ message: 'Role deleted successfully.' });
  },
};
