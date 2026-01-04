import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Card, CardContent, Button, Box, CircularProgress } from '@mui/material';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { doctorService } from '../api/doctorService';
import { handleApiError } from '../utils/helpers';

const DoctorDashboard = () => {
  const { user } = useAuthStore();
  const { showToast } = useToastStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, patientsData] = await Promise.all([
        doctorService.getStats(),
        doctorService.getPatients(),
      ]);
      setStats(statsData);
      setPatients(patientsData);
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
        Welcome, Dr. {user?.name || 'Doctor'}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Patients
              </Typography>
              <Typography variant="h5">{stats?.totalPatients || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Visits
              </Typography>
              <Typography variant="h5">{stats?.totalVisits || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Prescriptions
              </Typography>
              <Typography variant="h5">{stats?.totalPrescriptions || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Follow-ups
              </Typography>
              <Typography variant="h5">{stats?.pendingFollowUps || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" color="primary">
            Add Patient
          </Button>
          <Button variant="contained" color="primary">
            Create Visit
          </Button>
          <Button variant="outlined">
            View Patients
          </Button>
          <Button variant="outlined">
            View Prescriptions
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default DoctorDashboard;
