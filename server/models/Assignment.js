const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  instructions: {
    type: String
  },
  
  // Course Association
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Assignment Details
  type: {
    type: String,
    enum: ['homework', 'project', 'quiz', 'exam', 'presentation', 'essay', 'lab'],
    required: true
  },
  category: {
    type: String,
    enum: ['individual', 'group', 'peer-review'],
    default: 'individual'
  },
  
  // Timing
  assignedDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  availableFrom: {
    type: Date,
    default: Date.now
  },
  availableUntil: {
    type: Date
  },
  
  // Grading
  totalPoints: {
    type: Number,
    required: true,
    min: 0
  },
  passingScore: {
    type: Number,
    default: 60
  },
  gradingRubric: [{
    criterion: String,
    description: String,
    points: Number,
    levels: [{
      name: String,
      description: String,
      points: Number
    }]
  }],
  
  // Submission Settings
  submissionSettings: {
    allowLateSubmission: {
      type: Boolean,
      default: true
    },
    latePenalty: {
      type: Number,
      default: 10 // percentage per day
    },
    maxLateDays: {
      type: Number,
      default: 3
    },
    allowMultipleSubmissions: {
      type: Boolean,
      default: true
    },
    allowedFileTypes: [String],
    maxFileSize: {
      type: Number,
      default: 10 // MB
    },
    requireTextSubmission: {
      type: Boolean,
      default: false
    },
    requireFileSubmission: {
      type: Boolean,
      default: false
    }
  },
  
  // Group Settings (for group assignments)
  groupSettings: {
    minGroupSize: {
      type: Number,
      default: 1
    },
    maxGroupSize: {
      type: Number,
      default: 1
    },
    allowSelfGrouping: {
      type: Boolean,
      default: true
    },
    randomGrouping: {
      type: Boolean,
      default: false
    }
  },
  
  // Resources and Materials
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  links: [{
    title: String,
    url: String,
    description: String
  }],
  
  // Submissions
  submissions: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    submissionDate: {
      type: Date,
      default: Date.now
    },
    isLate: {
      type: Boolean,
      default: false
    },
    daysLate: {
      type: Number,
      default: 0
    },
    textSubmission: String,
    files: [{
      filename: String,
      originalName: String,
      path: String,
      size: Number,
      mimetype: String
    }],
    status: {
      type: String,
      enum: ['submitted', 'graded', 'returned', 'resubmitted'],
      default: 'submitted'
    },
    grade: {
      score: Number,
      percentage: Number,
      letterGrade: String,
      feedback: String,
      rubricScores: [{
        criterion: String,
        score: Number,
        feedback: String
      }],
      gradedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      gradedDate: Date
    },
    attempts: {
      type: Number,
      default: 1
    }
  }],
  
  // Analytics
  analytics: {
    totalSubmissions: {
      type: Number,
      default: 0
    },
    onTimeSubmissions: {
      type: Number,
      default: 0
    },
    lateSubmissions: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    highestScore: {
      type: Number,
      default: 0
    },
    lowestScore: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    }
  },
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'published', 'active', 'closed', 'graded'],
    default: 'draft'
  },
  
  // Visibility
  visibility: {
    type: String,
    enum: ['all', 'enrolled', 'specific'],
    default: 'enrolled'
  },
  specificStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Auto-grading (for quizzes)
  autoGrading: {
    enabled: {
      type: Boolean,
      default: false
    },
    questions: [{
      question: String,
      type: {
        type: String,
        enum: ['multiple-choice', 'true-false', 'short-answer', 'essay']
      },
      options: [String],
      correctAnswer: String,
      points: Number,
      explanation: String
    }],
    timeLimit: Number, // in minutes
    shuffleQuestions: {
      type: Boolean,
      default: false
    },
    showResults: {
      type: String,
      enum: ['immediately', 'after-due', 'manual'],
      default: 'after-due'
    }
  }
}, {
  timestamps: true
});

// Indexes
assignmentSchema.index({ course: 1 });
assignmentSchema.index({ instructor: 1 });
assignmentSchema.index({ dueDate: 1 });
assignmentSchema.index({ status: 1 });
assignmentSchema.index({ type: 1 });

// Virtual for days until due
assignmentSchema.virtual('daysUntilDue').get(function() {
  const now = new Date();
  const due = new Date(this.dueDate);
  const diffTime = due - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for submission count
assignmentSchema.virtual('submissionCount').get(function() {
  return this.submissions.length;
});

// Virtual for graded count
assignmentSchema.virtual('gradedCount').get(function() {
  return this.submissions.filter(sub => sub.status === 'graded').length;
});

// Method to check if assignment is available
assignmentSchema.methods.isAvailable = function() {
  const now = new Date();
  return this.status === 'published' &&
         now >= this.availableFrom &&
         (!this.availableUntil || now <= this.availableUntil);
};

// Method to check if assignment is overdue
assignmentSchema.methods.isOverdue = function() {
  return new Date() > this.dueDate;
};

// Method to submit assignment
assignmentSchema.methods.submitAssignment = function(studentId, submissionData) {
  const now = new Date();
  const isLate = now > this.dueDate;
  const daysLate = isLate ? Math.ceil((now - this.dueDate) / (1000 * 60 * 60 * 24)) : 0;
  
  // Check if late submissions are allowed
  if (isLate && !this.submissionSettings.allowLateSubmission) {
    throw new Error('Late submissions are not allowed for this assignment');
  }
  
  if (isLate && daysLate > this.submissionSettings.maxLateDays) {
    throw new Error(`Maximum late submission period of ${this.submissionSettings.maxLateDays} days exceeded`);
  }
  
  // Find existing submission
  const existingSubmissionIndex = this.submissions.findIndex(
    sub => sub.student.toString() === studentId.toString()
  );
  
  if (existingSubmissionIndex !== -1) {
    if (!this.submissionSettings.allowMultipleSubmissions) {
      throw new Error('Multiple submissions are not allowed for this assignment');
    }
    
    // Update existing submission
    this.submissions[existingSubmissionIndex] = {
      ...this.submissions[existingSubmissionIndex],
      ...submissionData,
      submissionDate: now,
      isLate,
      daysLate,
      status: 'submitted',
      attempts: this.submissions[existingSubmissionIndex].attempts + 1
    };
  } else {
    // Create new submission
    this.submissions.push({
      student: studentId,
      ...submissionData,
      submissionDate: now,
      isLate,
      daysLate,
      status: 'submitted',
      attempts: 1
    });
  }
  
  return this.save();
};

// Method to grade submission
assignmentSchema.methods.gradeSubmission = function(studentId, gradeData, graderId) {
  const submissionIndex = this.submissions.findIndex(
    sub => sub.student.toString() === studentId.toString()
  );
  
  if (submissionIndex === -1) {
    throw new Error('Submission not found');
  }
  
  const submission = this.submissions[submissionIndex];
  const score = gradeData.score;
  const percentage = (score / this.totalPoints) * 100;
  
  // Apply late penalty if applicable
  let finalScore = score;
  if (submission.isLate && this.submissionSettings.allowLateSubmission) {
    const penalty = (this.submissionSettings.latePenalty / 100) * submission.daysLate;
    finalScore = Math.max(0, score * (1 - penalty));
  }
  
  // Determine letter grade
  let letterGrade = 'F';
  if (percentage >= 97) letterGrade = 'A+';
  else if (percentage >= 93) letterGrade = 'A';
  else if (percentage >= 90) letterGrade = 'A-';
  else if (percentage >= 87) letterGrade = 'B+';
  else if (percentage >= 83) letterGrade = 'B';
  else if (percentage >= 80) letterGrade = 'B-';
  else if (percentage >= 77) letterGrade = 'C+';
  else if (percentage >= 73) letterGrade = 'C';
  else if (percentage >= 70) letterGrade = 'C-';
  else if (percentage >= 67) letterGrade = 'D+';
  else if (percentage >= 65) letterGrade = 'D';
  
  this.submissions[submissionIndex].grade = {
    score: finalScore,
    percentage: (finalScore / this.totalPoints) * 100,
    letterGrade,
    feedback: gradeData.feedback,
    rubricScores: gradeData.rubricScores,
    gradedBy: graderId,
    gradedDate: new Date()
  };
  
  this.submissions[submissionIndex].status = 'graded';
  
  return this.save();
};

// Method to calculate analytics
assignmentSchema.methods.calculateAnalytics = function() {
  const submissions = this.submissions;
  const gradedSubmissions = submissions.filter(sub => sub.status === 'graded');
  
  this.analytics.totalSubmissions = submissions.length;
  this.analytics.onTimeSubmissions = submissions.filter(sub => !sub.isLate).length;
  this.analytics.lateSubmissions = submissions.filter(sub => sub.isLate).length;
  
  if (gradedSubmissions.length > 0) {
    const scores = gradedSubmissions.map(sub => sub.grade.score);
    this.analytics.averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    this.analytics.highestScore = Math.max(...scores);
    this.analytics.lowestScore = Math.min(...scores);
  }
  
  return this.save();
};

// Static method to find assignments by course
assignmentSchema.statics.findByCourse = function(courseId) {
  return this.find({ course: courseId }).sort({ dueDate: 1 });
};

// Static method to find upcoming assignments
assignmentSchema.statics.findUpcoming = function(daysAhead = 7) {
  const now = new Date();
  const future = new Date(now.getTime() + (daysAhead * 24 * 60 * 60 * 1000));
  
  return this.find({
    dueDate: { $gte: now, $lte: future },
    status: 'published'
  }).sort({ dueDate: 1 });
};

module.exports = mongoose.model('Assignment', assignmentSchema);