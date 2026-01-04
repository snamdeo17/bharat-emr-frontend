import api from './api';

export const adminService = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },
  getDoctors: async (params) => {
    const response = await api.get('/admin/doctors', { params });
    return response.data;
  },
  getDoctorById: async (doctorId) => {
    const response = await api.get(`/admin/doctors/${doctorId}`);
    return response.data;
  },
  blockDoctor: async (doctorId) => {
    const response = await api.post(`/admin/doctors/${doctorId}/block`);
    return response.data;
  },
  unblockDoctor: async (doctorId) => {
    const response = await api.post(`/admin/doctors/${doctorId}/unblock`);
    return response.data;
  },
  getPatients: async (params) => {
    const response = await api.get('/admin/patients', { params });
    return response.data;
  },
  getPatientById: async (patientId) => {
    const response = await api.get(`/admin/patients/${patientId}`);
    return response.data;
  },
  blockPatient: async (patientId) => {
    const response = await api.post(`/admin/patients/${patientId}/block`);
    return response.data;
  },
  unblockPatient: async (patientId) => {
    const response = await api.post(`/admin/patients/${patientId}/unblock`);
    return response.data;
  },
  getStatistics: async () => {
    const response = await api.get('/admin/statistics');
    return response.data;
  },
};
