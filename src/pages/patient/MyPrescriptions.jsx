import React, { useState } from 'react';
import { Container, Typography, Card, Grid, Button, Chip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

const MyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([
    { id: 1, doctor: 'Dr. John Smith', date: '2024-01-15', medicines: ['Medicine A - 2x daily', 'Medicine B - 3x daily'], status: 'Active' },
    { id: 2, doctor: 'Dr. Sarah Johnson', date: '2024-01-10', medicines: ['Medicine C - 1x daily'], status: 'Active' },
  ]);

  const handleDownload = (id) => {
    console.log('Downloading prescription:', id);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>My Prescriptions</Typography>
      
      <Grid container spacing={3}>
        {prescriptions.map((prescription) => (
          <Grid item xs={12} md={6} key={prescription.id}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Prescription #{prescription.id}</Typography>
              <Typography variant="body2"><strong>Doctor:</strong> {prescription.doctor}</Typography>
              <Typography variant="body2"><strong>Date:</strong> {prescription.date}</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}><strong>Status:</strong> <Chip label={prescription.status} color="primary" size="small" /></Typography>
              
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>Medicines:</Typography>
              {prescription.medicines.map((medicine, idx) => (
                <Typography key={idx} variant="body2" sx={{ ml: 2 }}>• {medicine}</Typography>
              ))}
              
              <Button 
                variant="contained" 
                startIcon={<DownloadIcon />} 
                sx={{ mt: 2 }} 
                onClick={() => handleDownload(prescription.id)}
              >
                Download
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MyPrescriptions;
