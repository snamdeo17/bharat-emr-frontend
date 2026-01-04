import React, { useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([
    { id: 1, name: 'Dr. John Smith', specialization: 'Cardiology', license: 'LIC001', status: 'Active' },
    { id: 2, name: 'Dr. Sarah Johnson', specialization: 'Pediatrics', license: 'LIC002', status: 'Active' },
    { id: 3, name: 'Dr. Mike Brown', specialization: 'Orthopedics', license: 'LIC003', status: 'Inactive' },
  ]);
  const [open, setOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleDelete = (id) => {
    setDoctors(doctors.filter(doc => doc.id !== id));
  };

  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDoctor(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>Manage Doctors</Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Specialization</strong></TableCell>
              <TableCell><strong>License</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell>{doctor.name}</TableCell>
                <TableCell>{doctor.specialization}</TableCell>
                <TableCell>{doctor.license}</TableCell>
                <TableCell>{doctor.status}</TableCell>
                <TableCell>
                  <Button size="small" startIcon={<EditIcon />} onClick={() => handleEdit(doctor)}>Edit</Button>
                  <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(doctor.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Doctor</DialogTitle>
        <DialogContent>
          {selectedDoctor && (
            <>
              <TextField label="Name" defaultValue={selectedDoctor.name} fullWidth margin="normal" />
              <TextField label="Specialization" defaultValue={selectedDoctor.specialization} fullWidth margin="normal" />
              <TextField label="License" defaultValue={selectedDoctor.license} fullWidth margin="normal" />
            </>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ManageDoctors;
