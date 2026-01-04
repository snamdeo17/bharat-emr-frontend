import React, { useState } from 'react';
import { Container, Typography, Box, Card, Grid, Button, Stat } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [stats] = useState({
    totalDoctors: 45,
    totalPatients: 320,
    totalVisits: 1250,
    totalRevenue: '$45,000',
  });

  const chartData = [
    { month: 'Jan', visits: 120, revenue: 4000 },
    { month: 'Feb', visits: 150, revenue: 5200 },
    { month: 'Mar', visits: 200, revenue: 6800 },
    { month: 'Apr', visits: 180, revenue: 6200 },
    { month: 'May', visits: 220, revenue: 7500 },
    { month: 'Jun', visits: 250, revenue: 8200 },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>Admin Dashboard</Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary">Total Doctors</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{stats.totalDoctors}</Typography>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary">Total Patients</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{stats.totalPatients}</Typography>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary">Total Visits</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{stats.totalVisits}</Typography>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary">Total Revenue</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{stats.totalRevenue}</Typography>
          </Card>
        </Grid>
      </Grid>
      
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Monthly Statistics</Typography>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="visits" fill="#1976d2" />
            <Bar dataKey="revenue" fill="#388e3c" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </Container>
  );
};

export default AdminDashboard;
