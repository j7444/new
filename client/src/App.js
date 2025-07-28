import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './components/layouts/DashboardLayout';
import LoadingScreen from './components/LoadingScreen';

// Lazy load components for better performance
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const ForgotPassword = React.lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/auth/ResetPassword'));
const VerifyEmail = React.lazy(() => import('./pages/auth/VerifyEmail'));

// Student Dashboard Pages
const StudentDashboard = React.lazy(() => import('./pages/student/Dashboard'));
const StudentCourses = React.lazy(() => import('./pages/student/Courses'));
const StudentAssignments = React.lazy(() => import('./pages/student/Assignments'));
const StudentGrades = React.lazy(() => import('./pages/student/Grades'));
const StudentCalendar = React.lazy(() => import('./pages/student/Calendar'));
const StudentProfile = React.lazy(() => import('./pages/student/Profile'));
const StudentMessages = React.lazy(() => import('./pages/student/Messages'));

// Tutor Dashboard Pages
const TutorDashboard = React.lazy(() => import('./pages/tutor/Dashboard'));
const TutorCourses = React.lazy(() => import('./pages/tutor/Courses'));
const TutorAssignments = React.lazy(() => import('./pages/tutor/Assignments'));
const TutorGrades = React.lazy(() => import('./pages/tutor/Grades'));
const TutorStudents = React.lazy(() => import('./pages/tutor/Students'));
const TutorAnalytics = React.lazy(() => import('./pages/tutor/Analytics'));
const TutorProfile = React.lazy(() => import('./pages/tutor/Profile'));

// Admin Dashboard Pages
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const AdminUsers = React.lazy(() => import('./pages/admin/Users'));
const AdminCourses = React.lazy(() => import('./pages/admin/Courses'));
const AdminAnalytics = React.lazy(() => import('./pages/admin/Analytics'));
const AdminSettings = React.lazy(() => import('./pages/admin/Settings'));
const AdminReports = React.lazy(() => import('./pages/admin/Reports'));

// Shared Pages
const CourseDetail = React.lazy(() => import('./pages/shared/CourseDetail'));
const AssignmentDetail = React.lazy(() => import('./pages/shared/AssignmentDetail'));
const Announcements = React.lazy(() => import('./pages/shared/Announcements'));
const Discussion = React.lazy(() => import('./pages/shared/Discussion'));
const Settings = React.lazy(() => import('./pages/shared/Settings'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Loading component for suspense
const SuspenseLoader = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="60vh"
  >
    <CircularProgress size={40} />
  </Box>
);

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  const getDashboardRoute = () => {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'student':
        return '/student/dashboard';
      case 'tutor':
        return '/tutor/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/login';
    }
  };

  return (
    <div className="App">
      <AnimatePresence mode="wait">
        <Suspense fallback={<SuspenseLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                user ? <Navigate to={getDashboardRoute()} replace /> : <Login />
              } 
            />
            <Route 
              path="/register" 
              element={
                user ? <Navigate to={getDashboardRoute()} replace /> : <Register />
              } 
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />

            {/* Student Routes */}
            <Route
              path="/student/*"
              element={
                <PrivateRoute allowedRoles={['student']}>
                  <DashboardLayout userRole="student">
                    <Routes>
                      <Route path="dashboard" element={<StudentDashboard />} />
                      <Route path="courses" element={<StudentCourses />} />
                      <Route path="courses/:courseId" element={<CourseDetail />} />
                      <Route path="assignments" element={<StudentAssignments />} />
                      <Route path="assignments/:assignmentId" element={<AssignmentDetail />} />
                      <Route path="grades" element={<StudentGrades />} />
                      <Route path="calendar" element={<StudentCalendar />} />
                      <Route path="messages" element={<StudentMessages />} />
                      <Route path="announcements" element={<Announcements />} />
                      <Route path="discussions" element={<Discussion />} />
                      <Route path="profile" element={<StudentProfile />} />
                      <Route path="settings" element={<Settings />} />
                    </Routes>
                  </DashboardLayout>
                </PrivateRoute>
              }
            />

            {/* Tutor Routes */}
            <Route
              path="/tutor/*"
              element={
                <PrivateRoute allowedRoles={['tutor']}>
                  <DashboardLayout userRole="tutor">
                    <Routes>
                      <Route path="dashboard" element={<TutorDashboard />} />
                      <Route path="courses" element={<TutorCourses />} />
                      <Route path="courses/:courseId" element={<CourseDetail />} />
                      <Route path="assignments" element={<TutorAssignments />} />
                      <Route path="assignments/:assignmentId" element={<AssignmentDetail />} />
                      <Route path="grades" element={<TutorGrades />} />
                      <Route path="students" element={<TutorStudents />} />
                      <Route path="analytics" element={<TutorAnalytics />} />
                      <Route path="announcements" element={<Announcements />} />
                      <Route path="discussions" element={<Discussion />} />
                      <Route path="profile" element={<TutorProfile />} />
                      <Route path="settings" element={<Settings />} />
                    </Routes>
                  </DashboardLayout>
                </PrivateRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <DashboardLayout userRole="admin">
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="courses" element={<AdminCourses />} />
                      <Route path="courses/:courseId" element={<CourseDetail />} />
                      <Route path="analytics" element={<AdminAnalytics />} />
                      <Route path="reports" element={<AdminReports />} />
                      <Route path="announcements" element={<Announcements />} />
                      <Route path="settings" element={<AdminSettings />} />
                    </Routes>
                  </DashboardLayout>
                </PrivateRoute>
              }
            />

            {/* Default Route */}
            <Route
              path="/"
              element={<Navigate to={getDashboardRoute()} replace />}
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </div>
  );
}

export default App;