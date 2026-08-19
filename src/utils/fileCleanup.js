const fs = require("fs");
const path = require("path");
const logger = require("../config/winstonLoggerConfig");

/**
 * Clean up uploaded files when database operations fail
 * @param {Object} files - req.files object from multer
 * @param {Object} file - req.file object from multer (for single file uploads)
 */
const cleanupUploadedFiles = (files, file = null) => {
  try {
    // Handle multiple files (req.files)
    if (files && typeof files === 'object') {
      Object.values(files).forEach(fileArray => {
        if (Array.isArray(fileArray)) {
          fileArray.forEach(fileObj => {
            if (fileObj && fileObj.path && fs.existsSync(fileObj.path)) {
              fs.unlinkSync(fileObj.path);
              logger.info(`Cleaned up file: ${fileObj.path}`);
            }
          });
        }
      });
    }

    // Handle single file (req.file) - backward compatibility
    if (file && file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
      logger.info(`Cleaned up file: ${file.path}`);
    }
  } catch (error) {
    logger.error(`Error cleaning up files: ${error.message}`);
  }
};

/**
 * Clean up specific files by their paths
 * @param {Array} filePaths - Array of file paths to delete
 */
const cleanupFilesByPaths = (filePaths) => {
  if (!Array.isArray(filePaths)) return;
  
  try {
    filePaths.forEach(filePath => {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        logger.info(`Cleaned up file: ${filePath}`);
      }
    });
  } catch (error) {
    logger.error(`Error cleaning up files by paths: ${error.message}`);
  }
};

/**
 * Get all uploaded file paths from req.files and req.file
 * @param {Object} files - req.files object from multer
 * @param {Object} file - req.file object from multer
 * @returns {Array} Array of file paths
 */
const getUploadedFilePaths = (files, file = null) => {
  const filePaths = [];
  
  try {
    // Handle multiple files (req.files)
    if (files && typeof files === 'object') {
      Object.values(files).forEach(fileArray => {
        if (Array.isArray(fileArray)) {
          fileArray.forEach(fileObj => {
            if (fileObj && fileObj.path) {
              filePaths.push(fileObj.path);
            }
          });
        }
      });
    }

    // Handle single file (req.file)
    if (file && file.path) {
      filePaths.push(file.path);
    }
  } catch (error) {
    logger.error(`Error getting uploaded file paths: ${error.message}`);
  }
  
  return filePaths;
};

/**
 * Get the full path of a file in the uploads directory
 * @param {string} filename - The filename to get full path for
 * @returns {string} Full path to the file
 */
const getUploadPath = (filename) => {
  if (!filename) return null;
  return path.join(__dirname, '..', 'uploads', filename);
};

/**
 * Smart file management for updates - only replace files that are actually changed
 * @param {Object} existingRecord - The existing database record with current file names
 * @param {Object} newFiles - req.files object with new uploaded files
 * @param {Array} fileFields - Array of field names that contain file paths
 * @returns {Object} Object containing filesToDelete and updatedFields
 */
const manageFileUpdates = (existingRecord, newFiles, fileFields) => {
  const filesToDelete = [];
  const updatedFields = {};
  const newFilesToCleanup = []; // Files to cleanup if operation fails
  
  try {
    fileFields.forEach(fieldName => {
      const newFile = newFiles?.[fieldName]?.[0];
      const existingFileName = existingRecord[fieldName];
      
      if (newFile && newFile.filename) {
        // New file uploaded for this field
        updatedFields[fieldName] = newFile.filename;
        newFilesToCleanup.push(newFile.path);
        
        // Mark old file for deletion if it exists
        if (existingFileName) {
          const oldFilePath = getUploadPath(existingFileName);
          if (oldFilePath && fs.existsSync(oldFilePath)) {
            filesToDelete.push(oldFilePath);
          }
        }
      }
      // If no new file uploaded, keep the existing file (don't add to updatedFields)
    });
    
    return {
      filesToDelete,
      updatedFields,
      newFilesToCleanup
    };
  } catch (error) {
    logger.error(`Error managing file updates: ${error.message}`);
    return {
      filesToDelete: [],
      updatedFields: {},
      newFilesToCleanup
    };
  }
};

/**
 * Handle operator/helper file updates
 * @param {Object} existingRecord - Existing operator/helper record
 * @param {Object} newData - New data including photo
 * @param {Object} newFiles - req.files object
 * @param {string} photoFieldName - Field name for the photo (e.g., 'operatorPhoto')
 * @returns {Object} Updated data and files to delete
 */
const managePersonFileUpdate = (existingRecord, newData, newFiles, photoFieldName) => {
  const filesToDelete = [];
  const newFilesToCleanup = [];
  const updatedData = { ...newData };
  
  try {
    const newPhotoFile = newFiles?.[photoFieldName]?.[0];
    
    if (newPhotoFile && newPhotoFile.filename) {
      // New photo uploaded
      updatedData.photo = newPhotoFile.filename;
      newFilesToCleanup.push(newPhotoFile.path);
      
      // Mark old photo for deletion if it exists
      if (existingRecord?.photo) {
        const oldPhotoPath = getUploadPath(existingRecord.photo);
        if (oldPhotoPath && fs.existsSync(oldPhotoPath)) {
          filesToDelete.push(oldPhotoPath);
        }
      }
    } else if (existingRecord?.photo) {
      // No new photo uploaded, keep existing
      updatedData.photo = existingRecord.photo;
    }
    
    return {
      updatedData,
      filesToDelete,
      newFilesToCleanup
    };
  } catch (error) {
    logger.error(`Error managing person file update: ${error.message}`);
    return {
      updatedData,
      filesToDelete: [],
      newFilesToCleanup
    };
  }
};

/**
 * Handle driver file updates with indexed photos
 * @param {Array} existingDrivers - Existing driver records
 * @param {Array} newDrivers - New driver data
 * @param {Object} newFiles - req.files object
 * @returns {Object} Updated drivers and files to delete
 */
const manageDriverFileUpdates = (existingDrivers, newDrivers, newFiles) => {
  const filesToDelete = [];
  const newFilesToCleanup = [];
  const updatedDrivers = [];
  
  try {
    // Get all driver photo keys from uploaded files
    const driverPhotoKeys = Object.keys(newFiles || {}).filter((key) =>
      key.startsWith("driverPhoto")
    );
    
    newDrivers.forEach((driver, index) => {
      const updatedDriver = { ...driver };
      
      // Find corresponding photo for this driver index
      const photoKey = driverPhotoKeys.find((key) =>
        key.endsWith(`[${index}]`)
      );
      
      const newPhotoFile = newFiles?.[photoKey]?.[0];
      
      if (newPhotoFile && newPhotoFile.filename) {
        // New photo uploaded for this driver
        updatedDriver.photo = newPhotoFile.filename;
        newFilesToCleanup.push(newPhotoFile.path);
        
        // Find existing driver photo to delete
        const existingDriver = existingDrivers.find((ed, idx) => idx === index);
        if (existingDriver?.photo) {
          const oldPhotoPath = getUploadPath(existingDriver.photo);
          if (oldPhotoPath && fs.existsSync(oldPhotoPath)) {
            filesToDelete.push(oldPhotoPath);
          }
        }
      } else {
        // No new photo, try to keep existing photo if available
        const existingDriver = existingDrivers.find((ed, idx) => idx === index);
        if (existingDriver?.photo) {
          updatedDriver.photo = existingDriver.photo;
        }
      }
      
      updatedDrivers.push(updatedDriver);
    });
    
    return {
      updatedDrivers,
      filesToDelete,
      newFilesToCleanup
    };
  } catch (error) {
    logger.error(`Error managing driver file updates: ${error.message}`);
    return {
      updatedDrivers: newDrivers,
      filesToDelete: [],
      newFilesToCleanup
    };
  }
};

module.exports = {
  cleanupUploadedFiles,
  cleanupFilesByPaths,
  getUploadedFilePaths,
  getUploadPath,
  manageFileUpdates,
  managePersonFileUpdate,
  manageDriverFileUpdates
};