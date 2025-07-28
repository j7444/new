import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  School,
  Assignment,
  Grade,
  Calendar,
  Message,
  Announcement,
  Settings,
  Logout,
  Notifications,
  Person,
  People,
  Analytics,
  AdminPanelSettings
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import SidebarItem from './SidebarItem';

const drawerWidth = 280;

const DashboardLayout = ({ children, userRole }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { user, logout } = useAuth();
  const { connected } = useSocket();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    await logout();
  };

  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      { text: 'Dashboard', icon: <Dashboard />, path: `/${userRole}/dashboard` },
    ];

    switch (userRole) {
      case 'student':
        return [
          ...baseItems,
          { text: 'Courses', icon: <School />, path: '/student/courses' },
          { text: 'Assignments', icon: <Assignment />, path: '/student/assignments' },
          { text: 'Grades', icon: <Grade />, path: '/student/grades' },
          { text: 'Calendar', icon: <Calendar />, path: '/student/calendar' },
          { text: 'Messages', icon: <Message />, path: '/student/messages' },
          { text: 'Announcements', icon: <Announcement />, path: '/student/announcements' },
        ];
      
      case 'tutor':
        return [
          ...baseItems,
          { text: 'Courses', icon: <School />, path: '/tutor/courses' },
          { text: 'Assignments', icon: <Assignment />, path: '/tutor/assignments' },
          { text: 'Grades', icon: <Grade />, path: '/tutor/grades' },
          { text: 'Students', icon: <People />, path: '/tutor/students' },
          { text: 'Analytics', icon: <Analytics />, path: '/tutor/analytics' },
          { text: 'Announcements', icon: <Announcement />, path: '/tutor/announcements' },
        ];
      
      case 'admin':
        return [
          ...baseItems,
          { text: 'Users', icon: <People />, path: '/admin/users' },
          { text: 'Courses', icon: <School />, path: '/admin/courses' },
          { text: 'Analytics', icon: <Analytics />, path: '/admin/analytics' },
          { text: 'Reports', icon: <Assignment />, path: '/admin/reports' },
          { text: 'Announcements', icon: <Announcement />, path: '/admin/announcements' },
          { text: 'Settings', icon: <AdminPanelSettings />, path: '/admin/settings' },
        ];
      
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  const drawer = (
    <Box>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <School sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="h6" noWrap component="div" color="primary.main" fontWeight="bold">
            Academic Dashboard
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={user?.avatar}
            sx={{ width: 40, height: 40, mr: 2 }}
          >
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight="bold">
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary" textTransform="capitalize">
              {user?.role}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: connected ? 'success.main' : 'error.main'
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {connected ? 'Online' : 'Offline'}
          </Typography>
        </Box>
      </Box>
      
      <Divider />
      
      <List>
        {navigationItems.map((item) => (
          <SidebarItem
            key={item.path}
            text={item.text}
            icon={item.icon}
            path={item.path}
            onClick={isMobile ? handleDrawerToggle : undefined}
          />
        ))}
      </List>
      
      <Divider />
      
      <List>
        <SidebarItem
          text="Profile"
          icon={<Person />}
          path={`/${userRole}/profile`}
          onClick={isMobile ? handleDrawerToggle : undefined}
        />
        <SidebarItem
          text="Settings"
          icon={<Settings />}
          path={`/${userRole}/settings`}
          onClick={isMobile ? handleDrawerToggle : undefined}
        />
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Welcome back, {user?.firstName}!
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit">
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar
                src={user?.avatar}
                sx={{ width: 32, height: 32 }}
              >
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <Person sx={{ mr: 1 }} />
          Profile
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>
          <Settings sx={{ mr: 1 }} />
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <Logout sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;