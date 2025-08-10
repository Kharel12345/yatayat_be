const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/database');

const LedgerGroup = sequelize.define('LedgerGroup', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ledger_group_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    formula: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'accounting_ledgergroup',
    timestamps: false
});

const LedgerSubGroup = sequelize.define('LedgerSubGroup', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    sub_group_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'accounting_ledgersub_group',
    timestamps: false
});

module.exports = {
    LedgerGroup,
    LedgerSubGroup
};
