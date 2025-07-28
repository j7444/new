const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    
    // Check if user account is locked
    if (user.isLocked) {
      return res.status(423).json({ message: 'Account is locked due to too many failed login attempts' });
    }
    
    // Check if user is active
    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Account is not active' });
    }
    
    // Update last activity
    user.lastActivity = new Date();
    await user.save();
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Role-based access control
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authorization required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required role: ${roles.join(' or ')}` 
      });
    }
    
    next();
  };
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authorization required' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  next();
};

// Check if user is tutor or admin
const isTutorOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authorization required' });
  }
  
  if (!['tutor', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Tutor or admin access required' });
  }
  
  next();
};

// Check if user is student
const isStudent = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authorization required' });
  }
  
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Student access required' });
  }
  
  next();
};

// Check if user owns resource or is admin
const isOwnerOrAdmin = (resourceUserField = 'user') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authorization required' });
    }
    
    // Admin can access any resource
    if (req.user.role === 'admin') {
      return next();
    }
    
    // Check if user owns the resource
    const resourceUserId = req.resource ? req.resource[resourceUserField] : req.params.userId;
    
    if (resourceUserId && resourceUserId.toString() === req.user._id.toString()) {
      return next();
    }
    
    return res.status(403).json({ message: 'Access denied' });
  };
};

// Check course enrollment or instructor
const isCourseParticipant = async (req, res, next) => {
  try {
    const Course = require('../models/Course');
    const courseId = req.params.courseId || req.body.courseId;
    
    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Admin can access any course
    if (req.user.role === 'admin') {
      return next();
    }
    
    // Check if user is instructor
    if (course.instructor.toString() === req.user._id.toString()) {
      return next();
    }
    
    // Check if user is assistant
    if (course.assistants.includes(req.user._id)) {
      return next();
    }
    
    // Check if user is enrolled student
    const isEnrolled = course.enrolledStudents.some(
      enrollment => enrollment.student.toString() === req.user._id.toString() && 
                   enrollment.status === 'enrolled'
    );
    
    if (isEnrolled) {
      return next();
    }
    
    return res.status(403).json({ message: 'Access denied. You are not enrolled in this course.' });
  } catch (error) {
    console.error('Course participant check error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Optional authentication (for public routes that can benefit from user context)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.status === 'active' && !user.isLocked) {
        req.user = user;
        // Update last activity
        user.lastActivity = new Date();
        await user.save();
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

// Rate limiting for sensitive operations
const sensitiveOperation = (req, res, next) => {
  // Additional security checks for sensitive operations
  if (!req.user) {
    return res.status(401).json({ message: 'Authorization required' });
  }
  
  // Check if user has recently performed too many sensitive operations
  // This could be implemented with Redis or in-memory store
  
  next();
};

// Validate email verification
const requireEmailVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authorization required' });
  }
  
  if (!req.user.emailVerified) {
    return res.status(403).json({ 
      message: 'Email verification required',
      code: 'EMAIL_NOT_VERIFIED'
    });
  }
  
  next();
};

module.exports = {
  auth,
  authorize,
  isAdmin,
  isTutorOrAdmin,
  isStudent,
  isOwnerOrAdmin,
  isCourseParticipant,
  optionalAuth,
  sensitiveOperation,
  requireEmailVerification
};