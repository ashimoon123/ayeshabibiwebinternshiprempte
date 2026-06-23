const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Bookmark = sequelize.define('Bookmark', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  resourceType: {
    type: DataTypes.ENUM('Note', 'Lecture', 'PastPaper'),
    allowNull: false,
  },
  resourceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'bookmarks',
});

Bookmark.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Bookmark, { foreignKey: 'userId', as: 'bookmarks' });

module.exports = Bookmark;
