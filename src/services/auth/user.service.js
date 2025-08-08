const { User } = require("../../../models/user.model");
// const { modules } = require("../../utils/modulesDetails");

const findByUsername = async (username) => {
  return await User.findOne({
    where: { username, status: 1 },
    attributes: ["user_id", "username", "password", "name", "user_type"],
  });
};

const getUserList = async () => {
  try {
    return await User.findAll({
      where: { status: 1 },
      attributes: ["user_id", "username", "user_type"],
    });
  } catch (error) {
    throw new Error(error);
  }
};

const createUser = async (userDetails) => {
  try {
    return await sequelize.transaction(async (t) => {
      const {
        name,
        address,
        contact,
        username,
        password,
        status,
        branch,
        created_by,
      } = userDetails;

      const user = await User.create(
        {
          name,
          address,
          contact,
          username,
          password,
          status,
          created_by,
        },
        { transaction: t }
      );

      if (branch.length > 0) {
        const branchData = branch.map((b) => ({
          user_id: user.user_id,
          branch_id: b,
          created_by,
          status: 1,
        }));
        await UserBranchInfo.bulkCreate(branchData, { transaction: t });
      }

      return user;
    });
  } catch (error) {
    throw new Error(error);
  }
};

const getUserPagination = async (
  limit,
  offset,
  status,
  name,
  viewAll,
  user_id
) => {
  try {
    const where = { status };
    if (!viewAll) where.created_by = user_id;
    if (name) where.name = { [Op.like]: `${name}%` };

    const { rows, count } = await User.findAndCountAll({
      where,
      attributes: [
        "user_id",
        "name",
        "address",
        "contact",
        "username",
        "status",
        "user_type",
      ],
      include: [
        {
          model: UserBranchInfo,
          where: { status: 1 },
          required: false,
          include: [
            {
              model: BranchInfo,
              where: { status: 1 },
              required: false,
            },
          ],
        },
      ],
      order: [["user_id", "DESC"]],
      limit,
      offset,
      distinct: true,
    });

    return { data: rows, total: count };
  } catch (error) {
    throw new Error(error);
  }
};



const updateUser = async (userObj, userLogDetails, user_type) => {
  try {
    return await sequelize.transaction(async (t) => {
      const {
        user_id,
        name,
        address,
        contact,
        username,
        password,
        status,
        branch,
        created_by,
      } = userObj;

      // Update user
      await User.update(
        {
          name,
          address,
          contact,
          username,
          ...(password && { password }),
          status,
        },
        { where: { user_id }, transaction: t }
      );

      // Update branch info
      await UserBranchInfo.update(
        { status: 0 },
        { where: { user_id }, transaction: t }
      );

      if (branch.length > 0) {
        for (const b of branch) {
          const exists = await UserBranchInfo.findOne({
            where: { user_id, branch_id: b },
            transaction: t,
          });
          if (exists) {
            await exists.update({ status, branch_id: b }, { transaction: t });
          } else {
            await UserBranchInfo.create(
              { user_id, branch_id: b, created_by, status },
              { transaction: t }
            );
          }
        }
      }
    });
  } catch (error) {
    throw new Error(error);
  }
};

const getUserType = async (user_id) => {
  try {
    const user = await User.findOne({
      where: { user_id },
      attributes: ["user_type"],
    });
    return user ? user.user_type : null;
  } catch (error) {
    throw new Error(error);
  }
};

// const createUserPermission = async (obj) => {
//   try {
//     const result = await UserPermissionInfo.createUserPermission(obj);
//     return result;
//   } catch (error) {
//     throw new Error(error);
//   }
// };

// const updateUserPermission = async (obj) => {
//   try {
//     const result = await UserPermissionInfo.updateUserPermission(obj);
//     return result;
//   } catch (error) {
//     throw new Error(error);
//   }
// };

// const getPermissionDetail = async (user_id) => {
//   try {
//     const result = await UserPermissionInfo.getUserModuleDetails(user_id);
//     return result;
//   } catch (error) {
//     throw new Error(error);
//   }
// };

module.exports = {
  getUserList,
  createUser,
  getUserPagination,
//   getPermissionDetail,
  updateUser,
  getUserList,
  getUserType,
//   createUserPermission,
//   updateUserPermission,
  findByUsername,
};
