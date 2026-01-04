import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h1" sx={{ fontSize: '4rem', color: 'error.main' }}>403</Typography>
        <Typography variant="h4" gutterBottom>Access Denied</Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          You don't have permission to access this resource.
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/')}>
          Go Home
        </Button>
      </Box>
    </Container>
  );
};
export default UnauthorizedPage;
