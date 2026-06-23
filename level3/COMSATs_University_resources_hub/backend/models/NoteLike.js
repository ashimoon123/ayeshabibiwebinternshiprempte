const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Note = require('./Note');

const NoteLike = sequelize.define('NoteLike', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
}, {
  timestamps: true,
  tableName: 'note_likes',
});

NoteLike.belongsTo(User, { foreignKey: 'userId', as: 'user' });
NoteLike.belongsTo(Note, { foreignKey: 'noteId', as: 'note' });
User.hasMany(NoteLike, { foreignKey: 'userId', as: 'noteLikes' });
Note.hasMany(NoteLike, { foreignKey: 'noteId', as: 'likes' });

module.exports = NoteLike;
