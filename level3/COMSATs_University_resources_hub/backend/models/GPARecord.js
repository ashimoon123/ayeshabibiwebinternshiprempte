const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const GPARecord = sequelize.define('GPARecord', {
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  courses: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  sgpa: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  cgpa: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'gpa_records',
});

GPARecord.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(GPARecord, { foreignKey: 'userId', as: 'gpaRecords' });

module.exports = GPARecord;
