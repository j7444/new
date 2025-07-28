import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  Button,
  Paper,
  Divider
} from '@mui/material';
import {
  School,
  Assignment,
  Grade,
  TrendingUp,
  CalendarToday,
  Announcement,
  AccessTime,
  CheckCircle
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();

  // Mock data - in real app, this would come from API
  const stats = [
    {
      title: 'Enrolled Courses',
      value: '6',
      icon: <School />,
      color: '#1976d2',
      change: '+2 this semester'
    },
    {
      title: 'Pending Assignments',
      value: '4',
      icon: <Assignment />,
      color: '#ff9800',
      change: '2 due this week'
    },
    {
      title: 'Current GPA',
      value: '3.85',
      icon: <Grade />,
      color: '#4caf50',
      change: '+0.15 from last semester'
    },
    {
      title: 'Completion Rate',
      value: '92%',
      icon: <TrendingUp />,
      color: '#9c27b0',
      change: '+5% this month'
    }
  ];

  const recentActivities = [
    {
      type: 'assignment',
      title: 'Database Design Assignment',
      course: 'CS 301',
      time: '2 hours ago',
      status: 'submitted',
      icon: <Assignment />
    },
    {
      type: 'grade',
      title: 'Midterm Exam Results',
      course: 'MATH 205',
      time: '1 day ago',
      status: 'graded',
      grade: 'A-',
      icon: <Grade />
    },
    {
      type: 'announcement',
      title: 'Class Schedule Change',
      course: 'ENG 101',
      time: '2 days ago',
      status: 'new',
      icon: <Announcement />
    }
  ];

  const upcomingDeadlines = [
    {
      title: 'Research Paper',
      course: 'History 201',
      dueDate: 'Tomorrow',
      priority: 'high'
    },
    {
      title: 'Lab Report #3',
      course: 'Chemistry 101',
      dueDate: 'Oct 25',
      priority: 'medium'
    },
    {
      title: 'Group Presentation',
      course: 'Business 301',
      dueDate: 'Oct 28',
      priority: 'low'
    }
  ];

  const courseProgress = [
    { name: 'Computer Science 301', progress: 85, grade: 'A' },
    { name: 'Mathematics 205', progress: 78, grade: 'B+' },
    { name: 'English 101', progress: 92, grade: 'A-' },
    { name: 'History 201', progress: 65, grade: 'B' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Welcome back, {user?.firstName}! 👋
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Here's what's happening with your studies today
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div variants={itemVariants}>
              <Card
                sx={{
                  height: '100%',
                  background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}05)`,
                  border: `1px solid ${stat.color}20`,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        backgroundColor: stat.color,
                        width: 48,
                        height: 48,
                        mr: 2
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.title}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {stat.change}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid item xs={12} lg={8}>
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Recent Activities
                </Typography>
                <List>
                  {recentActivities.map((activity, index) => (
                    <React.Fragment key={index}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar sx={{ backgroundColor: 'primary.main' }}>
                            {activity.icon}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle2">
                                {activity.title}
                              </Typography>
                              {activity.grade && (
                                <Chip
                                  label={activity.grade}
                                  size="small"
                                  color="success"
                                />
                              )}
                              <Chip
                                label={activity.status}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              {activity.course} • {activity.time}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < recentActivities.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Upcoming Deadlines */}
        <Grid item xs={12} lg={4}>
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Upcoming Deadlines
                </Typography>
                <List dense>
                  {upcomingDeadlines.map((deadline, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          <AccessTime fontSize="small" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={deadline.title}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              {deadline.course}
                            </Typography>
                            <Chip
                              label={deadline.dueDate}
                              size="small"
                              color={
                                deadline.priority === 'high' ? 'error' :
                                deadline.priority === 'medium' ? 'warning' : 'default'
                              }
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 2 }}
                  startIcon={<CalendarToday />}
                >
                  View Full Calendar
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Course Progress */}
        <Grid item xs={12}>
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Course Progress
                </Typography>
                <Grid container spacing={3}>
                  {courseProgress.map((course, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {course.name}
                          </Typography>
                          <Chip
                            label={course.grade}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <LinearProgress
                            variant="determinate"
                            value={course.progress}
                            sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="body2" fontWeight="bold">
                            {course.progress}%
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default StudentDashboard;