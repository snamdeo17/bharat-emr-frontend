import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DoctorRegistrationPage from './pages/DoctorRegistrationPage';
import PatientRegistrationPage from './pages/PatientRegistrationPage';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import AddPatient from './pages/doctor/AddPatient';
import Consultation from './pages/doctor/Consultation';
import PatientRegistry from './pages/doctor/PatientRegistry';
import PatientDetails from './pages/doctor/PatientDetails';
import Schedule from './pages/doctor/Schedule';
import MedicalHistory from './pages/doctor/MedicalHistory';
import VisitDetails from './pages/doctor/VisitDetails';
import Settings from './pages/doctor/Settings';
import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user?.userType !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Main App Routes
const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            user?.userType === 'DOCTOR' ? (
              <Navigate to="/doctor/dashboard" replace />
            ) : (
              <Navigate to="/patient/dashboard" replace />
            )
          ) : (
            <LandingPage />
          )
        }
      />
      <Route path="/login/:userType" element={<LoginPage />} />
      <Route path="/register/doctor" element={<DoctorRegistrationPage />} />
      <Route path="/register/patient" element={<PatientRegistrationPage />} />

      {/* Doctor Routes */}
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute requiredRole="DOCTOR">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/patients/add"
        element={
          <ProtectedRoute requiredRole="DOCTOR">
            <AddPatient />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/patients"
        element={
          <ProtectedRoute requiredRole="DOCTOR">
            <PatientRegistry />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/patients/:patientId"
        element={
          <ProtectedRoute requiredRole="DOCTOR">
            <PatientDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/consultation/:patientId"
        element={
          <ProtectedRoute requiredRole="DOCTOR">
            <Consultation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/schedule"
        element={
          <ProtectedRoute requiredRole="DOCTOR">
            <Schedule />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/history"
        element={
          <ProtectedRoute requiredRole="DOCTOR">
            <MedicalHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/visit/:visitId"
        element={
          <ProtectedRoute requiredRole="DOCTOR">
            <VisitDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/settings"
        element={
          <ProtectedRoute requiredRole="DOCTOR">
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Patient Routes */}
      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute requiredRole="PATIENT">
            <PatientDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/visit/:visitId"
        element={
          <ProtectedRoute requiredRole="PATIENT">
            <VisitDetails />
          </ProtectedRoute>
        }
      />
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App Component
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
