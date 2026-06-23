const { Sequelize } = require('sequelize');
const path = require('path');

// Create a Sequelize instance for SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ SQLite database connected successfully!');
    
    // Sync models (create tables if they don't exist)
    await sequelize.sync({ alter: true }); // Use alter: true to update tables
    console.log('✅ Database models synchronized!');
    
    return sequelize;
  } catch (error) {
    console.error('❌ SQLite database connection error:', error.message);
    console.error(error.stack);
    throw error;
  }
};

module.exports = { connectDB, sequelize };
