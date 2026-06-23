const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Lecture = sequelize.define('Lecture', {
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
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  videoFile: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isYouTube: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  timestamps: true,
  tableName: 'lectures',
});

Lecture.belongsTo(User, { foreignKey: 'uploadedBy', as: 'uploadedByUser' });
User.hasMany(Lecture, { foreignKey: 'uploadedBy', as: 'uploadedLectures' });

module.exports = Lecture;
