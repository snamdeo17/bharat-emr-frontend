import api from './api';

export const patientService = {
  getProfile: async () => {
    const response = await api.get('/patients/profile');
    return response.data;
  },
  updateProfile: async (patientData) => {
    const response = await api.put('/patients/profile', patientData);
    return response.data;
  },
  getVisitHistory: async (params) => {
    const response = await api.get('/patients/visits', { params });
    return response.data;
  },
  getVisitById: async (visitId) => {
    const response = await api.get(`/patients/visits/${visitId}`);
    return response.data;
  },
  getPrescriptions: async (params) => {
    const response = await api.get('/patients/prescriptions', { params });
    return response.data;
  },
  getPrescriptionById: async (prescriptionId) => {
    const response = await api.get(`/patients/prescriptions/${prescriptionId}`);
    return response.data;
  },
  getFollowUps: async (params) => {
    const response = await api.get('/patients/follow-ups', { params });
    return response.data;
  },
  getFollowUpById: async (followUpId) => {
    const response = await api.get(`/patients/follow-ups/${followUpId}`);
    return response.data;
  },
  getDoctors: async (params) => {
    const response = await api.get('/patients/doctors', { params });
    return response.data;
  },
};
