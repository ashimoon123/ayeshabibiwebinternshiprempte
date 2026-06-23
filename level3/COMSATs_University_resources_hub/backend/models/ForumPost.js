const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const ForumPost = sequelize.define('ForumPost', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  isReported: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
  tableName: 'forum_posts',
});

const Comment = sequelize.define('Comment', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'comments',
});

const CommentReply = sequelize.define('CommentReply', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'comment_replies',
});

const ForumPostUpvote = sequelize.define('ForumPostUpvote', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
}, {
  timestamps: true,
  tableName: 'forum_post_upvotes',
});

const ForumPostDownvote = sequelize.define('ForumPostDownvote', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
}, {
  timestamps: true,
  tableName: 'forum_post_downvotes',
});

const ForumPostReport = sequelize.define('ForumPostReport', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'forum_post_reports',
});

// Define Associations
ForumPost.belongsTo(User, { foreignKey: 'author', as: 'authorUser' });
User.hasMany(ForumPost, { foreignKey: 'author', as: 'forumPosts' });

Comment.belongsTo(User, { foreignKey: 'author', as: 'authorUser' });
Comment.belongsTo(ForumPost, { foreignKey: 'postId', as: 'post' });
User.hasMany(Comment, { foreignKey: 'author', as: 'comments' });
ForumPost.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });

CommentReply.belongsTo(User, { foreignKey: 'author', as: 'authorUser' });
CommentReply.belongsTo(Comment, { foreignKey: 'commentId', as: 'comment' });
User.hasMany(CommentReply, { foreignKey: 'author', as: 'commentReplies' });
Comment.hasMany(CommentReply, { foreignKey: 'commentId', as: 'replies' });

ForumPostUpvote.belongsTo(User, { foreignKey: 'userId', as: 'user' });
ForumPostUpvote.belongsTo(ForumPost, { foreignKey: 'postId', as: 'post' });
User.hasMany(ForumPostUpvote, { foreignKey: 'userId', as: 'forumPostUpvotes' });
ForumPost.hasMany(ForumPostUpvote, { foreignKey: 'postId', as: 'upvotes' });

ForumPostDownvote.belongsTo(User, { foreignKey: 'userId', as: 'user' });
ForumPostDownvote.belongsTo(ForumPost, { foreignKey: 'postId', as: 'post' });
User.hasMany(ForumPostDownvote, { foreignKey: 'userId', as: 'forumPostDownvotes' });
ForumPost.hasMany(ForumPostDownvote, { foreignKey: 'postId', as: 'downvotes' });

ForumPostReport.belongsTo(User, { foreignKey: 'userId', as: 'user' });
ForumPostReport.belongsTo(ForumPost, { foreignKey: 'postId', as: 'post' });
User.hasMany(ForumPostReport, { foreignKey: 'userId', as: 'forumPostReports' });
ForumPost.hasMany(ForumPostReport, { foreignKey: 'postId', as: 'reports' });

module.exports = { ForumPost, Comment, CommentReply, ForumPostUpvote, ForumPostDownvote, ForumPostReport };
