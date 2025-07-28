import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Grid,
  Container
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  School
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  const demoAccounts = [
    { role: 'Student', email: 'student@demo.com', password: 'demo123' },
    { role: 'Tutor', email: 'tutor@demo.com', password: 'demo123' },
    { role: 'Admin', email: 'admin@demo.com', password: 'demo123' }
  ];

  const handleDemoLogin = (email, password) => {
    setFormData({ email, password });
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          py: 4
        }}
      >
        <Grid container spacing={4} alignItems="center">
          {/* Left Side - Welcome */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    mb: 3
                  }}
                >
                  <School sx={{ fontSize: 48, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h3" component="h1" fontWeight="bold">
                    Academic
                    <Typography component="span" variant="h3" color="primary.main">
                      Dashboard
                    </Typography>
                  </Typography>
                </Box>
                
                <Typography variant="h5" color="text.secondary" paragraph>
                  Welcome to the future of academic management
                </Typography>
                
                <Typography variant="body1" color="text.secondary" paragraph>
                  A comprehensive platform designed for students, tutors, and administrators 
                  to manage courses, assignments, grades, and communications seamlessly.
                </Typography>

                <Box sx={{ mt: 4, display: { xs: 'none', md: 'block' } }}>
                  <Typography variant="h6" gutterBottom>
                    ✨ Key Features:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <Typography component="li" variant="body2" paragraph>
                      Real-time messaging and notifications
                    </Typography>
                    <Typography component="li" variant="body2" paragraph>
                      Advanced analytics and reporting
                    </Typography>
                    <Typography component="li" variant="body2" paragraph>
                      Interactive calendar and scheduling
                    </Typography>
                    <Typography component="li" variant="body2">
                      Secure file sharing and collaboration
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card
                sx={{
                  maxWidth: 400,
                  mx: 'auto',
                  boxShadow: 3,
                  borderRadius: 3
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
                    Sign In
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
                    Access your academic dashboard
                  </Typography>

                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}

                  <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      name="email"
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={!!errors.email}
                      helperText={errors.email}
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      fullWidth
                      name="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      error={!!errors.password}
                      helperText={errors.password}
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{
                        mt: 3,
                        mb: 2,
                        py: 1.5,
                        background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                        }
                      }}
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                    </Button>

                    <Box textAlign="center">
                      <Link
                        to="/forgot-password"
                        style={{ textDecoration: 'none', color: '#1976d2' }}
                      >
                        Forgot your password?
                      </Link>
                    </Box>

                    <Divider sx={{ my: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        Demo Accounts
                      </Typography>
                    </Divider>

                    <Grid container spacing={1}>
                      {demoAccounts.map((account) => (
                        <Grid item xs={4} key={account.role}>
                          <Button
                            fullWidth
                            variant="outlined"
                            size="small"
                            onClick={() => handleDemoLogin(account.email, account.password)}
                            sx={{ textTransform: 'none' }}
                          >
                            {account.role}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>

                    <Box textAlign="center" mt={3}>
                      <Typography variant="body2" color="text.secondary">
                        Don't have an account?{' '}
                        <Link
                          to="/register"
                          style={{ textDecoration: 'none', color: '#1976d2' }}
                        >
                          Sign up here
                        </Link>
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Login;