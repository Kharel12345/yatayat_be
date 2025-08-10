#!/usr/bin/env node

/**
 * Database Structure Fix Script
 * 
 * This script helps fix table structure mismatches between models and existing database.
 * Run this before re-enabling automatic migrations.
 */

const { Sequelize } = require('sequelize');
const config = require('./config/config.json');

const environment = process.env.NODE_ENV || 'development';
const { username, password, database, host, dialect } = config[environment];

const sequelize = new Sequelize(database, username, password, {
    host,
    dialect,
    logging: console.log
});

async function checkTableStructure() {
    try {
        console.log('🔍 Checking database table structures...\n');
        
        // Check user table
        const [userColumns] = await sequelize.query("DESCRIBE user");
        console.log('📋 User table structure:');
        userColumns.forEach(col => {
            console.log(`  - ${col.Field}: ${col.Type} ${col.Key} ${col.Extra}`);
        });
        
        console.log('\n📋 Expected User model structure:');
        console.log('  - id: INT PRIMARY KEY AUTO_INCREMENT');
        console.log('  - username: VARCHAR UNIQUE NOT NULL');
        console.log('  - email: VARCHAR UNIQUE NOT NULL');
        console.log('  - password: VARCHAR NOT NULL');
        console.log('  - name: VARCHAR');
        console.log('  - address: VARCHAR');
        console.log('  - contact: VARCHAR');
        console.log('  - status: INT');
        console.log('  - user_type: VARCHAR');
        console.log('  - created_by: INT');
        
        console.log('\n🔧 To fix the structure mismatch:');
        console.log('1. Run: npm run db:migrate:undo (to undo last migration)');
        console.log('2. Fix your models to match the expected structure');
        console.log('3. Run: npm run db:migrate (to apply corrected migrations)');
        console.log('4. Re-enable automatic migrations in src/config/database.js');
        
    } catch (error) {
        console.error('❌ Error checking table structure:', error.message);
    } finally {
        await sequelize.close();
    }
}

checkTableStructure(); 