import React from 'react';
import { Container, Typography, Box, Card, Grid, Button } from '@mui/material';
import { useAuthStore } from '../../store/authStore';

const PatientDashboard = () => {
  const { user } = useAuthStore();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>Welcome, {user?.name || 'Patient'}</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>My Visits</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>Check and manage your medical visits</Typography>
            <Button variant="contained" fullWidth>View Visits</Button>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>My Prescriptions</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>View and download your prescriptions</Typography>
            <Button variant="contained" fullWidth>View Prescriptions</Button>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Upcoming Appointments</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>No upcoming appointments</Typography>
            <Button variant="contained" fullWidth>Schedule Visit</Button>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Profile</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>Update your personal information</Typography>
            <Button variant="contained" fullWidth>Edit Profile</Button>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PatientDashboard;
