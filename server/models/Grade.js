const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  // Student and Course Information
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment'
  },
  
  // Grade Information
  numericGrade: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  letterGrade: {
    type: String,
    enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F', 'I', 'W', 'P', 'NP'],
    required: true
  },
  gpaPoints: {
    type: Number,
    min: 0,
    max: 4.0
  },
  
  // Grading Details
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gradedDate: {
    type: Date,
    default: Date.now
  },
  feedback: {
    type: String
  },
  
  // Grade Type
  gradeType: {
    type: String,
    enum: ['assignment', 'quiz', 'exam', 'project', 'participation', 'final', 'midterm'],
    required: true
  },
  
  // Semester Information
  semester: {
    type: String,
    enum: ['fall', 'spring', 'summer', 'winter'],
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  
  // Weight and Points
  maxPoints: {
    type: Number,
    required: true
  },
  earnedPoints: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    default: 1,
    min: 0
  },
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'published', 'final'],
    default: 'draft'
  },
  
  // Rubric Scores (for detailed grading)
  rubricScores: [{
    criterion: String,
    maxPoints: Number,
    earnedPoints: Number,
    feedback: String
  }],
  
  // Grade History (for tracking changes)
  history: [{
    previousGrade: Number,
    newGrade: Number,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    changeDate: {
      type: Date,
      default: Date.now
    },
    reason: String
  }],
  
  // Flags
  isExtraCredit: {
    type: Boolean,
    default: false
  },
  isDropped: {
    type: Boolean,
    default: false
  },
  isLate: {
    type: Boolean,
    default: false
  },
  latePenalty: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound indexes
gradeSchema.index({ student: 1, course: 1 });
gradeSchema.index({ course: 1, gradeType: 1 });
gradeSchema.index({ student: 1, semester: 1, academicYear: 1 });
gradeSchema.index({ gradedDate: 1 });

// Pre-save middleware to calculate GPA points and letter grade
gradeSchema.pre('save', function(next) {
  // Calculate GPA points based on letter grade
  const gpaMap = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F': 0.0,
    'I': 0.0, 'W': 0.0, 'P': 0.0, 'NP': 0.0
  };
  
  this.gpaPoints = gpaMap[this.letterGrade] || 0.0;
  
  // Auto-calculate letter grade if not provided
  if (!this.letterGrade && this.numericGrade !== undefined) {
    if (this.numericGrade >= 97) this.letterGrade = 'A+';
    else if (this.numericGrade >= 93) this.letterGrade = 'A';
    else if (this.numericGrade >= 90) this.letterGrade = 'A-';
    else if (this.numericGrade >= 87) this.letterGrade = 'B+';
    else if (this.numericGrade >= 83) this.letterGrade = 'B';
    else if (this.numericGrade >= 80) this.letterGrade = 'B-';
    else if (this.numericGrade >= 77) this.letterGrade = 'C+';
    else if (this.numericGrade >= 73) this.letterGrade = 'C';
    else if (this.numericGrade >= 70) this.letterGrade = 'C-';
    else if (this.numericGrade >= 67) this.letterGrade = 'D+';
    else if (this.numericGrade >= 65) this.letterGrade = 'D';
    else this.letterGrade = 'F';
    
    this.gpaPoints = gpaMap[this.letterGrade];
  }
  
  next();
});

// Static method to calculate student GPA
gradeSchema.statics.calculateStudentGPA = async function(studentId, semester = null, academicYear = null) {
  const query = { student: studentId, status: 'final' };
  if (semester) query.semester = semester;
  if (academicYear) query.academicYear = academicYear;
  
  const grades = await this.find(query).populate('course', 'credits');
  
  if (grades.length === 0) return 0;
  
  let totalGradePoints = 0;
  let totalCredits = 0;
  
  grades.forEach(grade => {
    const credits = grade.course.credits || 3; // Default to 3 credits if not specified
    totalGradePoints += grade.gpaPoints * credits;
    totalCredits += credits;
  });
  
  return totalCredits > 0 ? (totalGradePoints / totalCredits) : 0;
};

// Static method to get grade distribution for a course
gradeSchema.statics.getGradeDistribution = async function(courseId) {
  const distribution = await this.aggregate([
    { $match: { course: mongoose.Types.ObjectId(courseId), status: 'final' } },
    { $group: { _id: '$letterGrade', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  
  return distribution;
};

// Static method to get student transcript
gradeSchema.statics.getTranscript = async function(studentId) {
  const grades = await this.find({ 
    student: studentId, 
    status: 'final' 
  })
  .populate('course', 'courseCode title credits department')
  .sort({ academicYear: 1, semester: 1 });
  
  // Group by academic year and semester
  const transcript = {};
  grades.forEach(grade => {
    const key = `${grade.academicYear}-${grade.semester}`;
    if (!transcript[key]) {
      transcript[key] = {
        academicYear: grade.academicYear,
        semester: grade.semester,
        courses: [],
        semesterGPA: 0,
        totalCredits: 0
      };
    }
    transcript[key].courses.push(grade);
  });
  
  // Calculate semester GPAs
  for (const key in transcript) {
    const semester = transcript[key];
    let totalGradePoints = 0;
    let totalCredits = 0;
    
    semester.courses.forEach(grade => {
      const credits = grade.course.credits || 3;
      totalGradePoints += grade.gpaPoints * credits;
      totalCredits += credits;
    });
    
    semester.semesterGPA = totalCredits > 0 ? (totalGradePoints / totalCredits) : 0;
    semester.totalCredits = totalCredits;
  }
  
  return transcript;
};

// Method to update grade with history tracking
gradeSchema.methods.updateGrade = function(newNumericGrade, updatedBy, reason) {
  // Add to history
  this.history.push({
    previousGrade: this.numericGrade,
    newGrade: newNumericGrade,
    changedBy: updatedBy,
    reason: reason
  });
  
  // Update grade
  this.numericGrade = newNumericGrade;
  
  return this.save();
};

// Virtual for percentage
gradeSchema.virtual('percentage').get(function() {
  return this.maxPoints > 0 ? (this.earnedPoints / this.maxPoints) * 100 : 0;
});

// Virtual for pass/fail status
gradeSchema.virtual('isPassing').get(function() {
  return this.numericGrade >= 60; // Assuming 60% is passing
});

module.exports = mongoose.model('Grade', gradeSchema);