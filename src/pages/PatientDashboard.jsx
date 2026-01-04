import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Card, CardContent, Button, Box, CircularProgress } from '@mui/material';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { patientService } from '../api/patientService';
import { handleApiError } from '../utils/helpers';

const PatientDashboard = () => {
  const { user } = useAuthStore();
  const { showToast } = useToastStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await patientService.getStats();
      setStats(data);
    } catch (err) {
      showToast(handleApiError(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name || 'Patient'}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Visits
              </Typography>
              <Typography variant="h5">{stats?.totalVisits || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Prescriptions
              </Typography>
              <Typography variant="h5">{stats?.activePrescriptions || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Upcoming Follow-ups
              </Typography>
              <Typography variant="h5">{stats?.upcomingFollowUps || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Links
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" color="primary">
            View Visits
          </Button>
          <Button variant="contained" color="primary">
            View Prescriptions
          </Button>
          <Button variant="outlined">
            View Follow-ups
          </Button>
          <Button variant="outlined">
            Edit Profile
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PatientDashboard;
