export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
export const JWT_COOKIE_NAME = import.meta.env.VITE_JWT_COOKIE_NAME || 'bharatemr_token';
export const USER_COOKIE_NAME = import.meta.env.VITE_USER_COOKIE_NAME || 'bharatemr_user';

export const USER_ROLES = { DOCTOR: 'DOCTOR', PATIENT: 'PATIENT', ADMIN: 'ADMIN' };
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
export const GENDERS = ['MALE', 'FEMALE', 'OTHER'];
export const SPECIALIZATIONS = ['General Physician', 'Cardiologist', 'Dermatologist', 'ENT Specialist', 'Gynecologist', 'Neurologist', 'Orthopedic', 'Pediatrician', 'Psychiatrist', 'Urologist'];
export const VISIT_STATUS = { SCHEDULED: 'SCHEDULED', IN_PROGRESS: 'IN_PROGRESS', COMPLETED: 'COMPLETED', CANCELLED: 'CANCELLED' };
export const FOLLOW_UP_STATUS = { SCHEDULED: 'SCHEDULED', COMPLETED: 'COMPLETED', CANCELLED: 'CANCELLED', MISSED: 'MISSED' };
export const MEDICINE_DOSAGE_UNITS = ['mg', 'ml', 'IU', 'mcg', 'g'];
export const MEDICINE_FREQUENCIES = ['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', 'Every 4 hours', 'Every 6 hours', 'Every 8 hours', 'Every 12 hours', 'As needed'];
export const MEDICINE_DURATIONS = ['3 days', '5 days', '7 days', '10 days', '14 days', '21 days', '1 month', '2 months', '3 months', 'Continuous'];
