// services/branch.service.js
const { Op } = require('sequelize');
const  BranchInfo  = require('../../../models/branch.model'); // Sequelize auto-loader index.js

const branchSetup = async (branchSetupDetails) => {
  const { status, name, created_by } = branchSetupDetails;
  
  // Equivalent to INSERT INTO branch_info (...)
  const branch = await BranchInfo.create({
    name,
    status,
    created_by
  });

  return branch; // returns the created Sequelize instance
};

const updateBranch = async (branchSetupDetails, branch_id) => {
  const { status, name, created_by } = branchSetupDetails;

  // Equivalent to INSERT INTO branch_info (...)
  const branch = await BranchInfo.update({
    name,
    status,
    created_by
  },
    {
      where: { branch_id }
    });

  return branch; // returns the created Sequelize instance
};


const findBranchCode = async (branch_code) => {
  // Equivalent to SELECT COUNT(*) AS count FROM branch_info WHERE branch_code = ?
  const count = await BranchInfo.count({
    where: { branch_code }
  });

  return { count }; // match your old return structure
};

const getBranchList = async (status) => {
  // Equivalent to SELECT branch_id,branch_code,name,address,contact FROM branch_info WHERE status = 1
  const branches = await BranchInfo.findAll({
    where: { status: status },
  });

  return branches; // returns an array of objects
};

const checkBranchNameAvailable = async (name, id) => {
  const whereClause = {
    name,
  };
  // Exclude this specific ID if it's provided
  if (id !== null && id !== undefined) {
    whereClause.branch_id = { [Op.ne]: id };
  }

  const branch = await BranchInfo.findOne({ where: whereClause });

  return !branch; // true if name is available (not taken by others), false if taken
};
module.exports = {
  branchSetup,
  findBranchCode,
  getBranchList,
  checkBranchNameAvailable,
  updateBranch
};
