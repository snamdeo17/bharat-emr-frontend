import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/common/Navbar';
import Toast from './components/common/Toast';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import DoctorRegister from './pages/auth/DoctorRegister';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientManagement from './pages/doctor/PatientManagement';
import CreateVisit from './pages/doctor/CreateVisit';
import VisitDetails from './pages/doctor/VisitDetails';
import DoctorProfile from './pages/doctor/DoctorProfile';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import MyVisits from './pages/patient/MyVisits';
import MyPrescriptions from './pages/patient/MyPrescriptions';
import PatientProfile from './pages/patient/PatientProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageDoctors from './pages/admin/ManageDoctors';
import ManagePatients from './pages/admin/ManagePatients';

import { useAuthStore } from './store/authStore';

function App() {
  const { user } = useAuthStore();

  return (
    <Box className="app-container">
      <Toast />
      {user && <Navbar />}
      <Box className="main-content">
        <Routes>
          <Route path="/login" element={user ? <Navigate to={`/${user.role.toLowerCase()}/dashboard`} /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to={`/${user.role.toLowerCase()}/dashboard`} /> : <DoctorRegister />} />
          <Route path="/doctor/dashboard" element={<ProtectedRoute role="DOCTOR"><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/doctor/patients" element={<ProtectedRoute role="DOCTOR"><PatientManagement /></ProtectedRoute>} />
          <Route path="/doctor/visit/create" element={<ProtectedRoute role="DOCTOR"><CreateVisit /></ProtectedRoute>} />
          <Route path="/doctor/visit/:visitId" element={<ProtectedRoute role="DOCTOR"><VisitDetails /></ProtectedRoute>} />
          <Route path="/doctor/profile" element={<ProtectedRoute role="DOCTOR"><DoctorProfile /></ProtectedRoute>} />
          <Route path="/patient/dashboard" element={<ProtectedRoute role="PATIENT"><PatientDashboard /></ProtectedRoute>} />
          <Route path="/patient/visits" element={<ProtectedRoute role="PATIENT"><MyVisits /></ProtectedRoute>} />
          <Route path="/patient/prescriptions" element={<ProtectedRoute role="PATIENT"><MyPrescriptions /></ProtectedRoute>} />
          <Route path="/patient/profile" element={<ProtectedRoute role="PATIENT"><PatientProfile /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/doctors" element={<ProtectedRoute role="ADMIN"><ManageDoctors /></ProtectedRoute>} />
          <Route path="/admin/patients" element={<ProtectedRoute role="ADMIN"><ManagePatients /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to={user ? `/${user.role.toLowerCase()}/dashboard` : "/login"} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
