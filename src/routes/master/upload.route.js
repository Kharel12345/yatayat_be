const express = require('express');
const router = express.Router();
const { uploadController } = require('../../controllers/master');
const auth = require('../../middlewares/auth');

// Serve images from uploads folder
router.get('/fetchimage/:filename',
    // auth,
    uploadController.getImage);


module.exports = router; 