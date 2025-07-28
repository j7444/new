const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  // Basic Course Information
  courseCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  
  // Academic Details
  department: {
    type: String,
    required: true,
    trim: true
  },
  credits: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  level: {
    type: String,
    enum: ['undergraduate', 'graduate', 'doctorate'],
    required: true
  },
  year: {
    type: Number,
    min: 1,
    max: 6
  },
  semester: {
    type: String,
    enum: ['fall', 'spring', 'summer', 'winter'],
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  
  // Course Structure
  syllabus: {
    type: String
  },
  objectives: [String],
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  corequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  
  // Instructor Information
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assistants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Enrollment
  enrolledStudents: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    enrollmentDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['enrolled', 'dropped', 'completed', 'failed'],
      default: 'enrolled'
    }
  }],
  maxEnrollment: {
    type: Number,
    default: 50
  },
  
  // Schedule
  schedule: [{
    dayOfWeek: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    location: {
      building: String,
      room: String,
      capacity: Number
    },
    type: {
      type: String,
      enum: ['lecture', 'lab', 'tutorial', 'seminar'],
      default: 'lecture'
    }
  }],
  
  // Course Materials
  textbooks: [{
    title: String,
    author: String,
    isbn: String,
    edition: String,
    required: {
      type: Boolean,
      default: true
    }
  }],
  resources: [{
    title: String,
    type: {
      type: String,
      enum: ['book', 'article', 'video', 'website', 'software', 'other']
    },
    url: String,
    description: String
  }],
  
  // Assessment Structure
  gradingScheme: {
    assignments: {
      type: Number,
      default: 30
    },
    midterm: {
      type: Number,
      default: 30
    },
    final: {
      type: Number,
      default: 40
    },
    participation: {
      type: Number,
      default: 0
    },
    projects: {
      type: Number,
      default: 0
    }
  },
  
  // Course Content
  modules: [{
    title: String,
    description: String,
    order: Number,
    topics: [String],
    materials: [{
      title: String,
      type: {
        type: String,
        enum: ['document', 'video', 'audio', 'presentation', 'link']
      },
      url: String,
      fileSize: Number,
      uploadDate: {
        type: Date,
        default: Date.now
      }
    }],
    duration: Number // in hours
  }],
  
  // Important Dates
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  registrationDeadline: {
    type: Date
  },
  dropDeadline: {
    type: Date
  },
  
  // Course Status
  status: {
    type: String,
    enum: ['draft', 'published', 'active', 'completed', 'cancelled'],
    default: 'draft'
  },
  
  // Settings
  settings: {
    allowLateSubmissions: {
      type: Boolean,
      default: true
    },
    latePenalty: {
      type: Number,
      default: 10 // percentage per day
    },
    discussionEnabled: {
      type: Boolean,
      default: true
    },
    announcementsEnabled: {
      type: Boolean,
      default: true
    },
    gradesVisible: {
      type: Boolean,
      default: true
    }
  },
  
  // Analytics
  analytics: {
    totalViews: {
      type: Number,
      default: 0
    },
    averageGrade: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    },
    studentFeedback: {
      averageRating: {
        type: Number,
        default: 0
      },
      totalRatings: {
        type: Number,
        default: 0
      }
    }
  },
  
  // Tags and Categories
  tags: [String],
  category: {
    type: String,
    enum: ['core', 'elective', 'major', 'minor', 'general']
  },
  
  // External Integration
  lmsIntegration: {
    enabled: {
      type: Boolean,
      default: false
    },
    platform: String,
    courseId: String
  }
}, {
  timestamps: true
});

// Indexes
courseSchema.index({ courseCode: 1 });
courseSchema.index({ department: 1 });
courseSchema.index({ instructor: 1 });
courseSchema.index({ semester: 1, academicYear: 1 });
courseSchema.index({ status: 1 });
courseSchema.index({ tags: 1 });

// Virtual for enrollment count
courseSchema.virtual('enrollmentCount').get(function() {
  return this.enrolledStudents.filter(student => student.status === 'enrolled').length;
});

// Virtual for available spots
courseSchema.virtual('availableSpots').get(function() {
  return this.maxEnrollment - this.enrollmentCount;
});

// Virtual for course full name
courseSchema.virtual('fullName').get(function() {
  return `${this.courseCode} - ${this.title}`;
});

// Method to check if enrollment is open
courseSchema.methods.isEnrollmentOpen = function() {
  const now = new Date();
  return this.status === 'published' && 
         (!this.registrationDeadline || now <= this.registrationDeadline) &&
         this.enrollmentCount < this.maxEnrollment;
};

// Method to enroll a student
courseSchema.methods.enrollStudent = function(studentId) {
  if (!this.isEnrollmentOpen()) {
    throw new Error('Enrollment is not open for this course');
  }
  
  const isAlreadyEnrolled = this.enrolledStudents.some(
    student => student.student.toString() === studentId.toString() && 
               student.status === 'enrolled'
  );
  
  if (isAlreadyEnrolled) {
    throw new Error('Student is already enrolled in this course');
  }
  
  this.enrolledStudents.push({
    student: studentId,
    status: 'enrolled'
  });
  
  return this.save();
};

// Method to drop a student
courseSchema.methods.dropStudent = function(studentId) {
  const studentIndex = this.enrolledStudents.findIndex(
    student => student.student.toString() === studentId.toString() && 
               student.status === 'enrolled'
  );
  
  if (studentIndex === -1) {
    throw new Error('Student is not enrolled in this course');
  }
  
  const now = new Date();
  if (this.dropDeadline && now > this.dropDeadline) {
    throw new Error('Drop deadline has passed');
  }
  
  this.enrolledStudents[studentIndex].status = 'dropped';
  return this.save();
};

// Method to calculate average grade
courseSchema.methods.calculateAverageGrade = async function() {
  const Grade = mongoose.model('Grade');
  const grades = await Grade.find({ course: this._id });
  
  if (grades.length === 0) return 0;
  
  const total = grades.reduce((sum, grade) => sum + grade.numericGrade, 0);
  return total / grades.length;
};

// Static method to find courses by instructor
courseSchema.statics.findByInstructor = function(instructorId) {
  return this.find({ instructor: instructorId });
};

// Static method to find active courses
courseSchema.statics.findActive = function() {
  return this.find({ status: 'active' });
};

// Pre-save middleware to update analytics
courseSchema.pre('save', function(next) {
  if (this.isModified('enrolledStudents')) {
    const enrolled = this.enrolledStudents.filter(s => s.status === 'enrolled');
    const completed = this.enrolledStudents.filter(s => s.status === 'completed');
    
    if (enrolled.length > 0) {
      this.analytics.completionRate = (completed.length / enrolled.length) * 100;
    }
  }
  next();
});

module.exports = mongoose.model('Course', courseSchema);