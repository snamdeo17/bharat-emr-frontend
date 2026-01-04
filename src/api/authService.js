import api from './api';

export const authService = {
  sendOTP: async (mobileNumber, purpose) => {
    const response = await api.post('/otp/send', { mobileNumber, purpose });
    return response.data;
  },
  verifyOTP: async (mobileNumber, otp, purpose) => {
    const response = await api.post('/otp/verify', { mobileNumber, otp, purpose });
    return response.data;
  },
  registerDoctor: async (doctorData) => {
    const response = await api.post('/doctors/register', doctorData);
    return response.data;
  },
  loginDoctor: async (mobileNumber, otp) => {
    const response = await api.post('/doctors/login', { mobileNumber, otp });
    return response.data;
  },
  loginPatient: async (mobileNumber, otp) => {
    const response = await api.post('/patients/login', { mobileNumber, otp });
    return response.data;
  },
  loginAdmin: async (username, password) => {
    const response = await api.post('/admin/login', { username, password });
    return response.data;
  },
};
