import React, { useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const ManagePatients = () => {
  const [patients, setPatients] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '9876543210', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '9876543211', status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '9876543212', status: 'Inactive' },
  ]);
  const [open, setOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleDelete = (id) => {
    setPatients(patients.filter(pat => pat.id !== id));
  };

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPatient(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>Manage Patients</Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell>{patient.status}</TableCell>
                <TableCell>
                  <Button size="small" startIcon={<EditIcon />} onClick={() => handleEdit(patient)}>Edit</Button>
                  <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(patient.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Patient</DialogTitle>
        <DialogContent>
          {selectedPatient && (
            <>
              <TextField label="Name" defaultValue={selectedPatient.name} fullWidth margin="normal" />
              <TextField label="Email" defaultValue={selectedPatient.email} fullWidth margin="normal" />
              <TextField label="Phone" defaultValue={selectedPatient.phone} fullWidth margin="normal" />
            </>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ManagePatients;
