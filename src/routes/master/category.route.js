const express = require("express");
const router = express.Router();
const { categoryController } = require("../../controllers/master");
const auth = require("../../middlewares/auth");
// const { preauthorize } = require("../../utils/preAuthorize");

router.post("/createcategory", auth, categoryController.createCategory);
router.get("/getallcategories", auth, categoryController.getAllCategories);
router.get("/getcategories:id", auth, categoryController.getCategoryById);
router.put("/updatecategory/:id", auth, categoryController.updateCategory);
router.delete("/deletecategory:id", auth, categoryController.deleteCategory);

module.exports = router;
