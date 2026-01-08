import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity,
    ArrowLeft,
    User,
    Phone,
    Calendar,
    Users,
    MapPin,
    Heart,
    ShieldCheck,
    Mail,
    Globe
} from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../../config/api';

import DoctorSidebar from '../../components/DoctorSidebar';

const AddPatient = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const validationSchema = Yup.object({
        fullName: Yup.string()
            .min(3, 'Full name must be at least 3 characters')
            .required('Full name is required'),
        mobileNumber: Yup.string()
            .matches(/^[0-9]{10}$/, 'Invalid mobile number')
            .required('Mobile number is required'),
        email: Yup.string()
            .email('Invalid email address'),
        dateOfBirth: Yup.date()
            .max(new Date(), 'Date of birth cannot be in the future')
            .required('Date of birth is required'),
        gender: Yup.string()
            .oneOf(['MALE', 'FEMALE', 'OTHER'], 'Please select a gender')
            .required('Gender is required'),
        bloodGroup: Yup.string(),
        address: Yup.string()
            .required('Address is required'),
        city: Yup.string()
            .required('City is required'),
        state: Yup.string()
            .required('State is required'),
        pincode: Yup.string()
            .matches(/^[0-9]{6}$/, 'Invalid pincode')
            .required('Pincode is required'),
        emergencyContactName: Yup.string()
            .required('Required'),
        emergencyContactNumber: Yup.string()
            .matches(/^[0-9]{10}$/, 'Invalid number')
            .required('Required')
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        setLoading(true);
        setError('');
        try {
            await api.post('/doctor/patients/add', values);
            navigate('/doctor/patients');
        } catch (err) {
            setError(err.message || 'Failed to onboard patient');
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <DoctorSidebar />

            <main className="flex-1 p-8 overflow-y-auto h-screen min-w-0">
                <div className="max-w-4xl mx-auto">
                    {/* Header with Back Button */}
                    <div className="flex items-center gap-4 mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 hover:text-primary transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Onboarding Workflow</span>
                        </div>
                    </div>

                    {/* Intro Section */}
                    <div className="mb-12">
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                            Onboard New Patient
                        </h1>
                        <p className="text-lg text-gray-500 font-medium">
                            Fill in the details below to register a new patient to your practice.
                        </p>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl mb-10 flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                            <Activity className="w-6 h-6 shrink-0" />
                            <div className="font-bold">{error}</div>
                        </div>
                    )}

                    <Formik
                        initialValues={{
                            fullName: '',
                            mobileNumber: '',
                            email: '',
                            dateOfBirth: '',
                            gender: '',
                            bloodGroup: '',
                            address: '',
                            city: '',
                            state: '',
                            pincode: '',
                            emergencyContactName: '',
                            emergencyContactNumber: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, values, touched, errors }) => (
                            <Form className="space-y-10">
                                {/* Card 1: Identity */}
                                <div className="bg-white rounded-3xl p-8 md-p-12 shadow-premium border border-gray-50 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-subtle opacity-30 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />

                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="w-12 h-12 rounded-xl bg-primary-subtle flex items-center justify-center text-primary">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900">Identity & Contact</h3>
                                    </div>

                                    <div className="grid md-grid-cols-2 gap-x-8 gap-y-10">
                                        <div className="space-y-2">
                                            <label className="text-sm font-extrabold text-gray-700 ml-1 uppercase tracking-wider">Full Name *</label>
                                            <div className="flex items-center bg-gray-50 rounded-xl px-4 border border-transparent focus-within:border-primary focus-within:bg-white transition-all shadow-sm">
                                                <User className="text-gray-400 w-5 h-5 shrink-0" />
                                                <Field name="fullName" className="w-full bg-transparent border-none py-3 px-3 focus:outline-none font-bold text-gray-900" placeholder="Enter full name" />
                                            </div>
                                            <ErrorMessage name="fullName" component="div" className="text-red-500 text-xs font-bold ml-1" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-extrabold text-gray-700 ml-1 uppercase tracking-wider">Mobile Number *</label>
                                            <div className="flex items-center bg-gray-50 rounded-xl px-4 border border-transparent focus-within:border-primary focus-within:bg-white transition-all shadow-sm">
                                                <span className="text-gray-400 font-bold text-sm shrink-0">+91</span>
                                                <Field name="mobileNumber" className="w-full bg-transparent border-none py-3 px-3 focus:outline-none font-bold text-gray-900" placeholder="10-digit number" />
                                            </div>
                                            <ErrorMessage name="mobileNumber" component="div" className="text-red-500 text-xs font-bold ml-1" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-extrabold text-gray-700 ml-1 uppercase tracking-wider">Email Address</label>
                                            <div className="flex items-center bg-gray-50 rounded-xl px-4 border border-transparent focus-within:border-primary focus-within:bg-white transition-all shadow-sm">
                                                <Mail className="text-gray-400 w-5 h-5 shrink-0" />
                                                <Field name="email" type="email" className="w-full bg-transparent border-none py-3 px-3 focus:outline-none font-bold text-gray-900" placeholder="email@example.com" />
                                            </div>
                                            <ErrorMessage name="email" component="div" className="text-red-500 text-xs font-bold ml-1" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-extrabold text-gray-700 ml-1 uppercase tracking-wider">Date of Birth *</label>
                                            <div className="flex items-center bg-gray-50 rounded-xl px-4 border border-transparent focus-within:border-primary focus-within:bg-white transition-all shadow-sm">
                                                <Calendar className="text-gray-400 w-5 h-5 shrink-0" />
                                                <Field name="dateOfBirth" type="date" className="w-full bg-transparent border-none py-3 px-3 focus:outline-none font-bold text-gray-900" />
                                            </div>
                                            <ErrorMessage name="dateOfBirth" component="div" className="text-red-500 text-xs font-bold ml-1" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-extrabold text-gray-700 ml-1 uppercase tracking-wider">Gender *</label>
                                            <Field as="select" name="gender" className="input">
                                                <option value="">Select Gender</option>
                                                <option value="MALE">Male</option>
                                                <option value="FEMALE">Female</option>
                                                <option value="OTHER">Other</option>
                                            </Field>
                                            <ErrorMessage name="gender" component="div" className="text-red-500 text-xs font-bold ml-1" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-extrabold text-gray-700 ml-1 uppercase tracking-wider">Blood Group</label>
                                            <Field as="select" name="bloodGroup" className="input">
                                                <option value="">Select Blood Group</option>
                                                <option value="A+">A+</option>
                                                <option value="A-">A-</option>
                                                <option value="B+">B+</option>
                                                <option value="B-">B-</option>
                                                <option value="AB+">AB+</option>
                                                <option value="AB-">AB-</option>
                                                <option value="O+">O+</option>
                                                <option value="O-">O-</option>
                                            </Field>
                                            <ErrorMessage name="bloodGroup" component="div" className="text-red-500 text-xs font-bold ml-1" />
                                        </div>
                                    </div>
                                </div>

                                {/* Card 2: Location */}
                                <div className="bg-white rounded-3xl p-8 md-p-12 shadow-premium border border-gray-50 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 opacity-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />

                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-secondary">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900">Location Details</h3>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-2">
                                            <label className="text-sm font-extrabold text-gray-700 ml-1 uppercase tracking-wider">Street Address *</label>
                                            <Field name="address" as="textarea" rows="2" className="input pt-4" placeholder="Enter full address..." />
                                            <ErrorMessage name="address" component="div" className="text-red-500 text-xs font-bold ml-1" />
                                        </div>

                                        <div className="grid md-grid-cols-3 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-sm font-extrabold text-gray-700 ml-1 uppercase tracking-wider">City *</label>
                                                <Field name="city" className="input" placeholder="Mumbai" />
                                                <ErrorMessage name="city" component="div" className="text-red-500 text-xs font-bold ml-1" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-extrabold text-gray-700 ml-1 uppercase tracking-wider">State *</label>
                                                <Field name="state" className="input" placeholder="Maharashtra" />
                                                <ErrorMessage name="state" component="div" className="text-red-500 text-xs font-bold ml-1" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-extrabold text-gray-700 ml-1 uppercase tracking-wider">Pincode *</label>
                                                <Field name="pincode" className="input" placeholder="400001" maxLength="6" />
                                                <ErrorMessage name="pincode" component="div" className="text-red-500 text-xs font-bold ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 3: Emergency */}
                                <div className="bg-white rounded-3xl p-8 md-p-12 shadow-premium border border-gray-50 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 opacity-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />

                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                                            <Heart className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900">Emergency Contact</h3>
                                    </div>

                                    <div className="grid md-grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-sm font-extrabold text-gray-700 ml-1 uppercase tracking-wider">Contact Person *</label>
                                            <div className="flex items-center bg-gray-50 rounded-xl px-4 border border-transparent focus-within:border-primary focus-within:bg-white transition-all shadow-sm">
                                                <User className="text-gray-400 w-5 h-5 shrink-0" />
                                                <Field name="emergencyContactName" className="w-full bg-transparent border-none py-3 px-3 focus:outline-none font-bold text-gray-900" placeholder="Relation/Name" />
                                            </div>
                                            <ErrorMessage name="emergencyContactName" component="div" className="text-red-500 text-xs font-bold ml-1" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-extrabold text-gray-700 ml-1 uppercase tracking-wider">Contact Number *</label>
                                            <div className="flex items-center bg-gray-50 rounded-xl px-4 border border-transparent focus-within:border-primary focus-within:bg-white transition-all shadow-sm">
                                                <span className="text-gray-400 font-bold text-sm shrink-0">+91</span>
                                                <Field name="emergencyContactNumber" className="w-full bg-transparent border-none py-3 px-3 focus:outline-none font-bold text-gray-900" placeholder="10-digit number" />
                                            </div>
                                            <ErrorMessage name="emergencyContactNumber" component="div" className="text-red-500 text-xs font-bold ml-1" />
                                        </div>
                                    </div>
                                </div>

                                {/* CTA Section */}
                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={loading || isSubmitting}
                                        className="btn btn-primary w-full py-5 text-xl rounded-2xl shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70"
                                    >
                                        {loading || isSubmitting ? (
                                            <div className="flex items-center gap-4">
                                                <div className="spinner !w-6 !h-6 !border-white !border-t-transparent"></div>
                                                <span>Onboarding Patient...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <ShieldCheck className="w-6 h-6" />
                                                <span>Register & Onboard Patient</span>
                                            </div>
                                        )}
                                    </button>
                                    <p className="text-center text-gray-400 mt-6 font-semibold flex items-center justify-center gap-2">
                                        <Globe className="w-4 h-4" />
                                        Patient will receive a secure login via SMS
                                    </p>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </main>
        </div>
    );
};

export default AddPatient;
