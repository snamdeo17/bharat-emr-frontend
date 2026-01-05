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
            .required('Emergency contact name is required'),
        emergencyContactNumber: Yup.string()
            .matches(/^[0-9]{10}$/, 'Invalid mobile number')
            .required('Emergency contact number is required'),
    });

    const handleOnboard = async (values) => {
        setLoading(true);
        setError('');

        try {
            const payload = {
                ...values,
                mobileNumber: `+91${values.mobileNumber}`,
                emergencyContactNumber: `+91${values.emergencyContactNumber}`,
            };

            await api.post('/doctor/patients/add', payload);
            alert('Patient onboarded successfully!');
            navigate('/doctor/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to onboard patient');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header / Navbar Replacement */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/doctor/dashboard')}
                        className="group flex items-center gap-3 text-gray-500 hover:text-primary transition-all font-semibold"
                    >
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-primary-subtle group-hover:text-primary transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        Back to Dashboard
                    </button>
                    <div className="flex items-center gap-2 text-primary">
                        <ShieldCheck className="w-5 h-5 font-bold" />
                        <span className="text-sm font-bold uppercase tracking-wider">Secure Onboarding</span>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto mt-12 px-6">
                {/* Intro Section */}
                <div className="mb-12">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl mb-6 shadow-lg">
                        <Users className="w-7 h-7 text-white" />
                    </div>
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
                    onSubmit={handleOnboard}
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
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <Field name="fullName" className={`input !pl-12 ${touched.fullName && errors.fullName ? 'border-red-500' : ''}`} placeholder="Enter full name" />
                                        </div>
                                        <ErrorMessage name="fullName" component="div" className="text-red-500 text-xs font-bold ml-1" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-extrabold text-gray-700 ml-1 uppercase tracking-wider">Mobile Number *</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">+91</div>
                                            <Field name="mobileNumber" className={`input !pl-14 ${touched.mobileNumber && errors.mobileNumber ? 'border-red-500' : ''}`} placeholder="10-digit number" />
                                        </div>
                                        <ErrorMessage name="mobileNumber" component="div" className="text-red-500 text-xs font-bold ml-1" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-extrabold text-gray-700 ml-1 uppercase tracking-wider">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <Field name="email" type="email" className="input !pl-12" placeholder="email@example.com" />
                                        </div>
                                        <ErrorMessage name="email" component="div" className="text-red-500 text-xs font-bold ml-1" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-extrabold text-gray-700 ml-1 uppercase tracking-wider">Date of Birth *</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                <Calendar className="w-5 h-5" />
                                            </div>
                                            <Field name="dateOfBirth" type="date" className={`input !pl-12 ${touched.dateOfBirth && errors.dateOfBirth ? 'border-red-500' : ''}`} />
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
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <Field name="emergencyContactName" className="input !pl-12" placeholder="Relation/Name" />
                                        </div>
                                        <ErrorMessage name="emergencyContactName" component="div" className="text-red-500 text-xs font-bold ml-1" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-extrabold text-gray-700 ml-1 uppercase tracking-wider">Contact Number *</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">+91</div>
                                            <Field name="emergencyContactNumber" className="input !pl-14" placeholder="10-digit number" />
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
        </div>
    );
};

export default AddPatient;
