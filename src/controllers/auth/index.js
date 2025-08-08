const authControllers = require('./auth.controller')
const userControllers= require('./user.controller');
const branchControllers=require('./branch.controller');

module.exports = {
    authControllers,
    userControllers,
    branchControllers
}