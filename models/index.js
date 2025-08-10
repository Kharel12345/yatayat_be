'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Function to recursively load models from directories
const loadModels = (dir) => {
  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Recursively load models from subdirectories
      loadModels(fullPath);
    } else if (
      item.indexOf('.') !== 0 &&
      item !== basename &&
      item.slice(-3) === '.js' &&
      item.indexOf('.test.js') === -1 &&
      item.endsWith('.model.js') // Only load model files
    ) {
      try {
        const model = require(fullPath);
        if (model && model.name) {
          db[model.name] = model;
        }
      } catch (error) {
        console.warn(`Warning: Could not load model from ${fullPath}:`, error.message);
      }
    }
  });
};

// Load all models
loadModels(__dirname);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
