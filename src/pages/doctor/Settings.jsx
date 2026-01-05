import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Settings as SettingsIcon, User, Briefcase,
    Building, MapPin, Award, Save, ArrowLeft,
    Phone, Mail, Activity, ShieldCheck, Heart, Plus
} from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../../config/api';
import { useAuth } from '../../context/AuthContext';

import DoctorSidebar from '../../components/DoctorSidebar';

const Settings = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        specialization: Yup.string().required('Specialization is required'),
        qualification: Yup.string().required('Qualification is required'),
        clinicName: Yup.string().required('Clinic name is required'),
        clinicAddress: Yup.string().required('Address is required'),
        yearsOfExperience: Yup.number().min(0).required('Required')
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await api.get(`/doctor/profile`);
            setDoctor(data);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (values, { setSubmitting }) => {
        try {
            await api.put(`/doctor/profile`, values);
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Failed to update profile:', error);
            setMessage('Update failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="spinner"></div></div>;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <DoctorSidebar />

            <main className="flex-1 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <button
                                onClick={() => navigate('/doctor/dashboard')}
                                className="flex items-center gap-2 text-gray-400 font-bold hover:text-primary mb-2 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                            </button>
                            <h1 className="text-3xl font-black text-gray-900">Account Settings</h1>
                            <p className="text-gray-500 font-medium">Manage your professional profile and clinic details</p>
                        </div>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-2 ${message.includes('success') ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                            }`}>
                            <ShieldCheck className="w-5 h-5" /> {message}
                        </div>
                    )}

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Profile Brief */}
                        <div className="space-y-6">
                            <div className="card p-8 bg-white border-none shadow-sm text-center">
                                <div className="w-24 h-24 bg-primary-subtle text-primary rounded-3xl flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-xl relative group">
                                    <span className="text-3xl font-black">{doctor?.fullName?.charAt(0)}</span>
                                    <div className="absolute inset-0 bg-primary/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <Plus className="text-white w-6 h-6" />
                                    </div>
                                </div>
                                <h2 className="text-xl font-black text-gray-900 leading-tight">Dr. {doctor?.fullName}</h2>
                                <p className="text-xs font-black text-primary uppercase tracking-widest mt-1 mb-6">{doctor?.specialization}</p>

                                <div className="space-y-4 text-left border-t border-gray-50 pt-6">
                                    <div className="flex items-center gap-3 text-sm font-bold text-gray-400">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center"><Phone className="w-4 h-4" /></div>
                                        {doctor?.mobileNumber}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-bold text-gray-400">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center"><Heart className="w-4 h-4 text-red-400" /></div>
                                        Verified Doctor
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Settings Form */}
                        <div className="md:col-span-2">
                            <Formik
                                initialValues={{
                                    email: doctor?.email || '',
                                    specialization: doctor?.specialization || '',
                                    qualification: doctor?.qualification || '',
                                    yearsOfExperience: doctor?.yearsOfExperience || 0,
                                    clinicName: doctor?.clinicName || '',
                                    clinicAddress: doctor?.clinicAddress || '',
                                    profilePhotoUrl: doctor?.profilePhotoUrl || ''
                                }}
                                validationSchema={validationSchema}
                                onSubmit={handleUpdate}
                            >
                                {({ isSubmitting }) => (
                                    <Form className="space-y-6">
                                        <div className="card p-8 bg-white border-none shadow-sm">
                                            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                                                <User className="w-5 h-5 text-primary" /> Professional Information
                                            </h3>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                                                    <Field name="email" type="email" className="input bg-gray-50 border-none h-12" placeholder="doctor@example.com" />
                                                    <ErrorMessage name="email" component="div" className="text-red-500 text-[10px] font-bold" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Experience (Years)</label>
                                                    <Field name="yearsOfExperience" type="number" className="input bg-gray-50 border-none h-12" />
                                                    <ErrorMessage name="yearsOfExperience" component="div" className="text-red-500 text-[10px] font-bold" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Specialization</label>
                                                    <Field name="specialization" type="text" className="input bg-gray-50 border-none h-12" />
                                                    <ErrorMessage name="specialization" component="div" className="text-red-500 text-[10px] font-bold" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Qualification</label>
                                                    <Field name="qualification" type="text" className="input bg-gray-50 border-none h-12" />
                                                    <ErrorMessage name="qualification" component="div" className="text-red-500 text-[10px] font-bold" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card p-8 bg-white border-none shadow-sm">
                                            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                                                <Building className="w-5 h-5 text-primary" /> Clinic Information
                                            </h3>
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Clinic / Hospital Name</label>
                                                    <Field name="clinicName" type="text" className="input bg-gray-50 border-none h-12" />
                                                    <ErrorMessage name="clinicName" component="div" className="text-red-500 text-[10px] font-bold" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Clinic Address</label>
                                                    <Field name="clinicAddress" as="textarea" rows="3" className="input bg-gray-50 border-none py-4" />
                                                    <ErrorMessage name="clinicAddress" component="div" className="text-red-500 text-[10px] font-bold" />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="btn btn-primary w-full py-4 text-sm font-black shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? <div className="spinner border-white w-5 h-5"></div> : <><Save className="w-5 h-5" /> Save Changes</>}
                                        </button>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Settings;
