const { User, Role } = require("../models");
const { objectIdsAreValid } = require("../utils");

module.exports = {
  list: async (req, res) => {
    const users = await User.find({})
      .populate("roles")
      .select("-password");
    return res.json({ users });
  },

  get: (req, res) => {
    return res.json({ user: req.context.user });
  },

  setRoles: async (req, res) => {
    const { roleIds } = req.body;

    let roleCount = 0;

    if (objectIdsAreValid(roleIds)) {
      roleCount = await Role.countDocuments({ _id: { $in: roleIds } });
    }

    if (!(roleCount === roleIds.length)) {
      return res.status(400).json({
        message: "One or more of the role ids you provided are invalid."
      });
    }

    const { user } = req.context;
    user.roles = roleIds;
    user.save();

    const updated = await User.findOne({ _id: user._id }).populate("roles");

    return res.json({
      message: "Successfully updated user roles.",
      user: updated
    });
  }
};
