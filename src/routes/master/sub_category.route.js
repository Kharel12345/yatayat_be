const express = require("express");
const router = express.Router();
const { subCategoryController } = require("../../controllers/master");
const auth = require("../../middlewares/auth");

router.post("/sub-categories", auth, subCategoryController.createSubCategory);

router.get("/sub-categories", auth, subCategoryController.getAllSubCategory);

router.get("/sub-categories/:id", auth, subCategoryController.getByIdSubCategory);

router.put("/sub-categories/:id", auth, subCategoryController.updateSubCategory);

router.delete("/sub-categories/:id", auth, subCategoryController.deleteSubCategory);

module.exports = router;
