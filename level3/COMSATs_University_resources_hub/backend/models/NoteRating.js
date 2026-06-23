const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Note = require('./Note');

const NoteRating = sequelize.define('NoteRating', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
}, {
  timestamps: true,
  tableName: 'note_ratings',
});

NoteRating.belongsTo(User, { foreignKey: 'userId', as: 'user' });
NoteRating.belongsTo(Note, { foreignKey: 'noteId', as: 'note' });
User.hasMany(NoteRating, { foreignKey: 'userId', as: 'noteRatings' });
Note.hasMany(NoteRating, { foreignKey: 'noteId', as: 'ratings' });

module.exports = NoteRating;
