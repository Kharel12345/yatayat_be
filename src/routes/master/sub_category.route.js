const express = require("express");
const router = express.Router();
const { subCategoryController } = require("../../controllers/master");
const auth = require("../../middlewares/auth");
// const { preauthorize } = require("../../utils/preAuthorize");

router.post(
  "/createsubcategories",
  auth,
  subCategoryController.createSubCategory
);
router.get(
  "/getallsubcategories",
  auth,
  subCategoryController.getAllSubCategory
);
router.get(
  "/getsubcategories:subCategoryId",
  auth,
  subCategoryController.getByIdSubCategory
);
router.put(
  "/updatesubcategories:subCategoryId",
  auth,
  subCategoryController.updateSubCategory
);
router.delete(
  "/deletesubcategory:subCategoryId",
  auth,
  subCategoryController.deleteSubCategory
);

module.exports = router;
