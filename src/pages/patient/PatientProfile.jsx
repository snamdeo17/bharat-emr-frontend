import React, { useState } from 'react';
import { Container, Typography, Box, Card, TextField, Button, Grid } from '@mui/material';
import { useAuthStore } from '../../store/authStore';

const PatientProfile = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+91 9876543210',
    dateOfBirth: '1990-01-15',
    gender: 'Male',
    bloodGroup: 'O+',
    address: '123 Main Street, City, State',
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Profile updated:', profile);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>My Profile</Typography>
      
      <Card sx={{ p: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Personal Information</Typography>
              <Button 
                variant="outlined" 
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField 
              fullWidth 
              label="Full Name" 
              name="name"
              value={profile.name} 
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField 
              fullWidth 
              label="Email" 
              name="email"
              value={profile.email} 
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField 
              fullWidth 
              label="Phone" 
              name="phone"
              value={profile.phone} 
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField 
              fullWidth 
              label="Date of Birth" 
              name="dateOfBirth"
              type="date"
              value={profile.dateOfBirth}
              onChange={handleChange}
              disabled={!isEditing}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField 
              fullWidth 
              label="Gender" 
              name="gender"
              value={profile.gender} 
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField 
              fullWidth 
              label="Blood Group" 
              name="bloodGroup"
              value={profile.bloodGroup} 
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField 
              fullWidth 
              label="Address" 
              name="address"
              value={profile.address} 
              onChange={handleChange}
              disabled={!isEditing}
              multiline
              rows={3}
            />
          </Grid>
          
          {isEditing && (
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save Changes
              </Button>
            </Grid>
          )}
        </Grid>
      </Card>
    </Container>
  );
};

export default PatientProfile;
