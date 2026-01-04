import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Tabs,
  Tab,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { authService } from '../api/authService';
import { validateMobileNumber, handleApiError } from '../utils/helpers';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { showToast } = useToastStore();
  
  const [tabValue, setTabValue] = useState(0);
  const [step, setStep] = useState('mobile'); // mobile, otp
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [tempMobileNumber, setTempMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const roles = ['Doctor', 'Patient', 'Admin'];
  const currentRole = roles[tabValue];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    resetForm();
  };

  const resetForm = () => {
    setStep('mobile');
    setMobileNumber('');
    setOtp('');
    setTempMobileNumber('');
    setError('');
    setOtpSent(false);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateMobileNumber(mobileNumber)) {
      setError('Invalid mobile number. Enter 10 digits.');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.sendOTP(mobileNumber);
      if (response.success) {
        setTempMobileNumber(mobileNumber);
        setStep('otp');
        setOtpSent(true);
        showToast('OTP sent successfully', 'success');
      } else {
        setError(response.message || 'Failed to send OTP');
      }
    } catch (err) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setLoading(true);
    try {
      let loginResponse;

      if (currentRole === 'Doctor') {
        loginResponse = await authService.loginDoctor(tempMobileNumber, otp);
      } else if (currentRole === 'Patient') {
        loginResponse = await authService.loginPatient(tempMobileNumber, otp);
      } else if (currentRole === 'Admin') {
        loginResponse = await authService.loginAdmin(tempMobileNumber, otp);
      }

      if (loginResponse.success || loginResponse.user) {
        const user = loginResponse.user || loginResponse.data?.user;
        const token = loginResponse.token || loginResponse.data?.token;

        setAuth(user, token, currentRole.toLowerCase());
        showToast(`Welcome ${currentRole}!`, 'success');

        // Redirect based on role
        const dashboardRoutes = {
          doctor: '/doctor/dashboard',
          patient: '/patient/dashboard',
          admin: '/admin/dashboard',
        };

        navigate(dashboardRoutes[currentRole.toLowerCase()]);
      } else {
        setError(loginResponse.message || 'Invalid OTP');
      }
    } catch (err) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          🏥 Bharat EMR
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" sx={{ mb: 3 }}>
          Electronic Medical Records System
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab label="Doctor" />
            <Tab label="Patient" />
            <Tab label="Admin" />
          </Tabs>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {step === 'mobile' ? (
          <form onSubmit={handleSendOTP}>
            <TextField
              fullWidth
              label="Mobile Number"
              placeholder="Enter your 10-digit mobile number"
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              margin="normal"
              disabled={loading}
              inputProps={{ maxLength: '10' }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 3 }}
              disabled={loading || !mobileNumber}
            >
              {loading ? <CircularProgress size={24} /> : 'Send OTP'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              OTP sent to: {tempMobileNumber}
            </Typography>
            <TextField
              fullWidth
              label="Enter OTP"
              placeholder="6-digit OTP"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              margin="normal"
              disabled={loading}
              inputProps={{ maxLength: '6' }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 3 }}
              disabled={loading || !otp}
            >
              {loading ? <CircularProgress size={24} /> : 'Verify OTP'}
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => setStep('mobile')}
              sx={{ mt: 2 }}
              disabled={loading}
            >
              Change Mobile Number
            </Button>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default LoginPage;
