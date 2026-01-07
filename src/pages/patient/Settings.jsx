import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User, MapPin, Save, ArrowLeft,
    Phone, Mail, Activity, ShieldCheck, Heart, Home, Check
} from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import PatientSidebar from '../../components/PatientSidebar';

const PatientSettings = () => {
    const navigate = useNavigate();
    const { user, updateProfile, setTheme } = useAuth();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const isSaved = useRef(false);
    const initialTheme = useRef(user?.preferredTheme || 'modern');

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        address: Yup.string().required('Address is required'),
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await api.get(`/patient/profile`);
            setPatient(data);
            if (data.preferredTheme) setTheme(data.preferredTheme);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            if (!isSaved.current && initialTheme.current) {
                setTheme(initialTheme.current);
            }
        };
    }, [setTheme]);

    const handleUpdate = async (values, { setSubmitting }) => {
        try {
            const result = await updateProfile(values);
            if (result.success) {
                isSaved.current = true;
                initialTheme.current = values.preferredTheme;
                setMessage('Profile updated successfully!');
                setPatient(result.data);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setMessage(result.message);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
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
            <PatientSidebar />

            <main className="flex-1 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <button
                                onClick={() => navigate('/patient/dashboard')}
                                className="flex items-center gap-2 text-gray-400 font-bold hover:text-primary mb-2 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                            </button>
                            <h1 className="text-3xl font-black text-gray-900">Your Settings</h1>
                            <p className="text-gray-500 font-medium">Manage your personal profile and preferences</p>
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
                                <div className="w-24 h-24 bg-primary-subtle text-primary rounded-3xl flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-xl">
                                    <span className="text-3xl font-black">{patient?.fullName?.charAt(0)}</span>
                                </div>
                                <h2 className="text-xl font-black text-gray-900 leading-tight">{patient?.fullName}</h2>
                                <p className="text-xs font-black text-primary uppercase tracking-widest mt-1 mb-6">Patient ID: {patient?.patientId}</p>

                                <div className="space-y-4 text-left border-t border-gray-50 pt-6">
                                    <div className="flex items-center gap-3 text-sm font-bold text-gray-400">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center"><Phone className="w-4 h-4" /></div>
                                        {patient?.mobileNumber}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-bold text-gray-400">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center"><Heart className="w-4 h-4 text-red-400" /></div>
                                        Health Profile Active
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Settings Form */}
                        <div className="md:col-span-2">
                            <Formik
                                enableReinitialize
                                initialValues={{
                                    email: patient?.email || '',
                                    address: patient?.address || '',
                                    preferredTheme: patient?.preferredTheme || 'modern'
                                }}
                                validationSchema={validationSchema}
                                onSubmit={handleUpdate}
                            >
                                {({ isSubmitting, values, setFieldValue }) => {
                                    // Immediate Preview Effect
                                    // eslint-disable-next-line react-hooks/rules-of-hooks
                                    useEffect(() => {
                                        if (values.preferredTheme) {
                                            setTheme(values.preferredTheme);
                                        }
                                    }, [values.preferredTheme]);

                                    return (
                                        <Form className="space-y-6">
                                            <div className="card p-8 bg-white border-none shadow-sm">
                                                <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                                                    <User className="w-5 h-5 text-primary" /> Personal Information
                                                </h3>
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                                                        <Field name="email" type="email" className="input bg-gray-50 border-none h-12" placeholder="your@email.com" />
                                                        <ErrorMessage name="email" component="div" className="text-red-500 text-[10px] font-bold" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Full Address</label>
                                                        <Field name="address" as="textarea" rows="3" className="input bg-gray-50 border-none py-4" />
                                                        <ErrorMessage name="address" component="div" className="text-red-500 text-[10px] font-bold" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="card p-8 bg-white border-none shadow-sm">
                                                <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                                                    <Activity className="w-5 h-5 text-primary" /> Visual Preferences
                                                </h3>
                                                <div className="space-y-4">
                                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Preferred Theme</label>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        {[
                                                            { id: 'modern', name: 'Modern Blue', class: 'bg-blue-600' },
                                                            { id: 'ocean', name: 'Ocean Deep', class: 'bg-cyan-600' },
                                                            { id: 'nature', name: 'Healing Green', class: 'bg-emerald-600' },
                                                            { id: 'sunset', name: 'Sunset Bloom', class: 'bg-fuchsia-600' }
                                                        ].map((t) => (
                                                            <div
                                                                key={t.id}
                                                                onClick={() => {
                                                                    setFieldValue('preferredTheme', t.id);
                                                                    setTheme(t.id);
                                                                }}
                                                                className={`cursor-pointer rounded-2xl p-4 border-2 transition-all relative group ${values.preferredTheme === t.id ? 'theme-card-active' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                                                            >
                                                                <div className={`w-full h-12 ${t.class} rounded-xl mb-3 shadow-sm group-hover:shadow-md transition-shadow`}></div>
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`radio-orb ${values.preferredTheme === t.id ? 'radio-orb-active' : 'group-hover:border-gray-400'}`}>
                                                                        {values.preferredTheme === t.id && <div className="radio-inner" />}
                                                                    </div>
                                                                    <span className={`text-[11px] font-black uppercase tracking-wider ${values.preferredTheme === t.id ? 'text-primary' : 'text-gray-400'}`}>{t.name}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <Field name="preferredTheme" type="hidden" />
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
                                    );
                                }}
                            </Formik>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PatientSettings;
