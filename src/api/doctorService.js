import api from './api';

export const doctorService = {
  getProfile: async () => {
    const response = await api.get('/doctors/profile');
    return response.data;
  },
  updateProfile: async (doctorData) => {
    const response = await api.put('/doctors/profile', doctorData);
    return response.data;
  },
  getPatients: async (params) => {
    const response = await api.get('/doctors/patients', { params });
    return response.data;
  },
  getPatientById: async (patientId) => {
    const response = await api.get(`/doctors/patients/${patientId}`);
    return response.data;
  },
  onboardPatient: async (patientData) => {
    const response = await api.post('/doctors/patients', patientData);
    return response.data;
  },
  createVisit: async (visitData) => {
    const response = await api.post('/doctors/visits', visitData);
    return response.data;
  },
  getVisits: async (params) => {
    const response = await api.get('/doctors/visits', { params });
    return response.data;
  },
  createPrescription: async (prescriptionData) => {
    const response = await api.post('/doctors/prescriptions', prescriptionData);
    return response.data;
  },
  getPrescriptions: async (params) => {
    const response = await api.get('/doctors/prescriptions', { params });
    return response.data;
  },
  createFollowUp: async (followUpData) => {
    const response = await api.post('/doctors/follow-ups', followUpData);
    return response.data;
  },
  getFollowUps: async (params) => {
    const response = await api.get('/doctors/follow-ups', { params });
    return response.data;
  },
};
