import React from 'react';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const SidebarItem = ({ text, icon, path, onClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = location.pathname === path;

  const handleClick = () => {
    navigate(path);
    if (onClick) {
      onClick();
    }
  };

  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={handleClick}
        sx={{
          backgroundColor: isActive ? 'primary.main' : 'transparent',
          color: isActive ? 'white' : 'text.primary',
          '&:hover': {
            backgroundColor: isActive ? 'primary.main' : 'action.hover',
          },
          mx: 1,
          borderRadius: 1,
        }}
      >
        <ListItemIcon
          sx={{
            color: isActive ? 'white' : 'text.secondary',
            minWidth: 40,
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
};

export default SidebarItem;