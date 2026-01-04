import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const PatientManagement = () => {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Patient Management</Typography>
      <Box sx={{ mt: 2 }}>Patient management page - Manage your patients here</Box>
    </Container>
  );
};

export default PatientManagement;
