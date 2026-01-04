import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Bharat EMR
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography>{user?.name}</Typography>
          <Button color="inherit" onClick={() => { logout(); navigate('/'); }}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
