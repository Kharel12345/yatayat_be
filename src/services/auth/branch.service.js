// services/branch.service.js
const  BranchInfo  = require('../../../models/branch.model'); // Sequelize auto-loader index.js

const branchSetup = async (branchSetupDetails) => {
  const { branch_code, name, address, contact, created_by } = branchSetupDetails;
  
  // Equivalent to INSERT INTO branch_info (...)
  const branch = await BranchInfo.create({
    branch_code,
    name,
    address,
    contact,
    created_by
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

const getBranchList = async () => {
  // Equivalent to SELECT branch_id,branch_code,name,address,contact FROM branch_info WHERE status = 1
  const branches = await BranchInfo.findAll({
    where: { status: 1 },
    attributes: ['branch_id', 'branch_code', 'name', 'address', 'contact']
  });

  return branches; // returns an array of objects
};

module.exports = {
  branchSetup,
  findBranchCode,
  getBranchList
};
