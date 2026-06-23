const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const PastPaper = sequelize.define('PastPaper', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  file: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  downloadCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  timestamps: true,
  tableName: 'past_papers',
});

PastPaper.belongsTo(User, { foreignKey: 'uploadedBy', as: 'uploadedByUser' });
PastPaper.belongsTo(User, { foreignKey: 'approvedBy', as: 'approvedByUser', allowNull: true });
User.hasMany(PastPaper, { foreignKey: 'uploadedBy', as: 'uploadedPastPapers' });
User.hasMany(PastPaper, { foreignKey: 'approvedBy', as: 'approvedPastPapers' });

module.exports = PastPaper;
