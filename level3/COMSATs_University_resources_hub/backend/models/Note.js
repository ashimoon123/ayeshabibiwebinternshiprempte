const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Note = sequelize.define('Note', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  courseCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  file: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  averageRating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  downloadCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  timestamps: true,
  tableName: 'notes',
});

// Define associations
Note.belongsTo(User, { foreignKey: 'uploadedBy', as: 'uploadedByUser' });
User.hasMany(Note, { foreignKey: 'uploadedBy', as: 'uploadedNotes' });

module.exports = Note;
