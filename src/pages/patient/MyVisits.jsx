import React, { useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';

const MyVisits = () => {
  const [visits, setVisits] = useState([
    { id: 1, doctor: 'Dr. John Smith', date: '2024-01-15', diagnosis: 'Fever', status: 'Completed' },
    { id: 2, doctor: 'Dr. Sarah Johnson', date: '2024-01-10', diagnosis: 'Cough', status: 'Completed' },
  ]);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [open, setOpen] = useState(false);

  const handleViewDetails = (visit) => {
    setSelectedVisit(visit);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedVisit(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>My Visits</Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Doctor</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Diagnosis</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visits.map((visit) => (
              <TableRow key={visit.id}>
                <TableCell>{visit.doctor}</TableCell>
                <TableCell>{visit.date}</TableCell>
                <TableCell>{visit.diagnosis}</TableCell>
                <TableCell>{visit.status}</TableCell>
                <TableCell>
                  <Button variant="outlined" size="small" onClick={() => handleViewDetails(visit)}>View Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Visit Details</DialogTitle>
        <DialogContent>
          {selectedVisit && (
            <>
              <Typography><strong>Doctor:</strong> {selectedVisit.doctor}</Typography>
              <Typography><strong>Date:</strong> {selectedVisit.date}</Typography>
              <Typography><strong>Diagnosis:</strong> {selectedVisit.diagnosis}</Typography>
              <Typography><strong>Status:</strong> {selectedVisit.status}</Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default MyVisits;
