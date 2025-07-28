const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  
  // Author Information
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Scope
  scope: {
    type: String,
    enum: ['system', 'course', 'department', 'role'],
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  department: String,
  targetRole: {
    type: String,
    enum: ['student', 'tutor', 'admin']
  },
  
  // Priority and Type
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  type: {
    type: String,
    enum: ['general', 'assignment', 'exam', 'event', 'maintenance', 'emergency'],
    default: 'general'
  },
  
  // Visibility and Status
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  isSticky: {
    type: Boolean,
    default: false
  },
  
  // Scheduling
  publishDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date
  },
  
  // Attachments
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String
  }],
  
  // Interaction
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Comments/Replies
  allowComments: {
    type: Boolean,
    default: false
  },
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  
  // Tags
  tags: [String]
}, {
  timestamps: true
});

// Indexes
announcementSchema.index({ author: 1 });
announcementSchema.index({ course: 1 });
announcementSchema.index({ scope: 1 });
announcementSchema.index({ status: 1 });
announcementSchema.index({ publishDate: 1 });
announcementSchema.index({ priority: 1 });
announcementSchema.index({ tags: 1 });

// Virtual for read count
announcementSchema.virtual('readCount').get(function() {
  return this.readBy.length;
});

// Method to mark as read by user
announcementSchema.methods.markAsRead = function(userId) {
  const alreadyRead = this.readBy.some(read => read.user.toString() === userId.toString());
  if (!alreadyRead) {
    this.readBy.push({ user: userId });
    this.views += 1;
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to add comment
announcementSchema.methods.addComment = function(authorId, content) {
  if (!this.allowComments) {
    throw new Error('Comments are not allowed on this announcement');
  }
  
  this.comments.push({
    author: authorId,
    content: content
  });
  
  return this.save();
};

// Static method to find announcements for user
announcementSchema.statics.findForUser = function(userId, userRole, userDepartment, userCourses = []) {
  const now = new Date();
  
  const query = {
    status: 'published',
    publishDate: { $lte: now },
    $or: [
      { expiryDate: { $exists: false } },
      { expiryDate: { $gte: now } }
    ],
    $or: [
      { scope: 'system' },
      { scope: 'role', targetRole: userRole },
      { scope: 'department', department: userDepartment },
      { scope: 'course', course: { $in: userCourses } }
    ]
  };
  
  return this.find(query)
    .populate('author', 'firstName lastName avatar')
    .populate('course', 'courseCode title')
    .sort({ isSticky: -1, priority: -1, publishDate: -1 });
};

// Static method to find urgent announcements
announcementSchema.statics.findUrgent = function() {
  const now = new Date();
  
  return this.find({
    status: 'published',
    priority: 'urgent',
    publishDate: { $lte: now },
    $or: [
      { expiryDate: { $exists: false } },
      { expiryDate: { $gte: now } }
    ]
  }).populate('author', 'firstName lastName');
};

module.exports = mongoose.model('Announcement', announcementSchema);