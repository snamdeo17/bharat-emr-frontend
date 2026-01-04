import React from 'react';
import { Container, Typography, Box, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CreateVisit = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/doctor/dashboard');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>Create Visit</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField fullWidth label="Patient" margin="normal" required />
        <TextField fullWidth label="Diagnosis" margin="normal" required />
        <TextField fullWidth label="Treatment" margin="normal" required multiline rows={4} />
        <Button variant="contained" type="submit" sx={{ mt: 2 }}>Save Visit</Button>
      </Box>
    </Container>
  );
};

export default CreateVisit;
