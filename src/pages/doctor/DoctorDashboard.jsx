import React from 'react';
import { Container, Box, Typography, Grid, Paper, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import PatientsIcon from '@mui/icons-material/Groups';
import VisitsIcon from '@mui/icons-material/Event';
import PrescriptionsIcon from '@mui/icons-material/LocalPharmacy';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const stats = [
    { title: 'Total Patients', value: 0, icon: PatientsIcon, action: '/doctor/patients' },
    { title: 'Today Visits', value: 0, icon: VisitsIcon, action: '/doctor/visit/create' },
    { title: 'Prescriptions', value: 0, icon: PrescriptionsIcon }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Welcome, Dr. {user?.name}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage your patients and medical records
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Icon sx={{ fontSize: 40, color: 'primary.main' }} />
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        {stat.title}
                      </Typography>
                      <Typography variant="h6">{stat.value}</Typography>
                    </Box>
                  </Box>
                  {stat.action && (
                    <Button 
                      size="small" 
                      sx={{ mt: 2 }}
                      onClick={() => navigate(stat.action)}
                    >
                      View
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" onClick={() => navigate('/doctor/visit/create')}>
            Create Visit
          </Button>
          <Button variant="outlined" onClick={() => navigate('/doctor/patients')}>
            View Patients
          </Button>
          <Button variant="outlined" onClick={() => navigate('/doctor/profile')}>
            My Profile
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default DoctorDashboard;
