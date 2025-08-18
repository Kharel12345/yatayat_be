const express = require('express');
const router = express.Router();
const { uploadController } = require('../../controllers/master');

// Serve images from uploads folder
router.get('/image/:filename', uploadController.getImage);

module.exports = router; 