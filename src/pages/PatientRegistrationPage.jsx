import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft, User, Phone, Calendar, Users } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../config/api';

const PatientRegistrationPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState('phone'); // 'phone', 'otp', 'details'
    const [mobileNumber, setMobileNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const validationSchema = Yup.object({
        fullName: Yup.string()
            .min(3, 'Full name must be at least 3 characters')
            .required('Full name is required'),
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

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');

        if (mobileNumber.length !== 10) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        setLoading(true);
        try {
            await api.post('/otp/send', {
                mobileNumber: `+91${mobileNumber}`,
                purpose: 'REGISTRATION',
            });
            setStep('otp');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');

        if (otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            await api.post('/otp/verify', {
                mobileNumber: `+91${mobileNumber}`,
                otp,
                purpose: 'REGISTRATION',
            });
            setStep('details');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleRegistration = async (values) => {
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/patient/register', {
                ...values,
                mobileNumber: `+91${mobileNumber}`,
                emergencyContactNumber: `+91${values.emergencyContactNumber}`,
            });

            if (response.data.success) {
                alert('Registration successful! Please login to continue.');
                navigate('/login/patient');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => {
                        if (step === 'details') setStep('otp');
                        else if (step === 'otp') setStep('phone');
                        else navigate('/login/patient');
                    }}
                    className="btn btn-ghost mb-6 hover:bg-white"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>

                {/* Registration Card */}
                <div className="card shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Patient Registration
                        </h1>
                        <p className="text-gray-600">
                            {step === 'phone' && 'Enter your mobile number to get started'}
                            {step === 'otp' && 'Verify your mobile number'}
                            {step === 'details' && 'Complete your profile'}
                        </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center mb-8">
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'phone' ? 'bg-green-600 text-white' : 'bg-green-500 text-white'}`}>
                                1
                            </div>
                            <div className={`w-16 h-1 ${step !== 'phone' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'otp' ? 'bg-green-600 text-white' : step === 'details' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                                2
                            </div>
                            <div className={`w-16 h-1 ${step === 'details' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'details' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                                3
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {/* Step 1: Phone Number */}
                    {step === 'phone' && (
                        <form onSubmit={handleSendOTP}>
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Mobile Number
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Phone className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div className="absolute inset-y-0 left-12 flex items-center pointer-events-none">
                                        <span className="text-gray-600 font-medium">+91</span>
                                    </div>
                                    <input
                                        type="tel"
                                        className="input pl-24"
                                        placeholder="Enter 10-digit mobile number"
                                        value={mobileNumber}
                                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        maxLength={10}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || mobileNumber.length !== 10}
                                className="btn btn-primary w-full py-4 text-lg"
                            >
                                {loading ? (
                                    <div className="spinner border-white border-t-transparent w-6 h-6"></div>
                                ) : (
                                    'Send OTP'
                                )}
                            </button>
                        </form>
                    )}

                    {/* Step 2: OTP Verification */}
                    {step === 'otp' && (
                        <form onSubmit={handleVerifyOTP}>
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Enter OTP
                                </label>
                                <input
                                    type="text"
                                    className="input text-center text-2xl tracking-widest font-bold"
                                    placeholder="000000"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    maxLength={6}
                                    required
                                />
                                <p className="text-sm text-gray-500 mt-2 text-center">
                                    OTP sent to +91 {mobileNumber}
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || otp.length !== 6}
                                className="btn btn-primary w-full py-4 text-lg mb-4"
                            >
                                {loading ? (
                                    <div className="spinner border-white border-t-transparent w-6 h-6"></div>
                                ) : (
                                    'Verify OTP'
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleSendOTP}
                                disabled={loading}
                                className="btn btn-ghost w-full"
                            >
                                Resend OTP
                            </button>
                        </form>
                    )}

                    {/* Step 3: Registration Details */}
                    {step === 'details' && (
                        <Formik
                            initialValues={{
                                fullName: '',
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
                            onSubmit={handleRegistration}
                        >
                            {({ isSubmitting }) => (
                                <Form className="space-y-6">
                                    {/* Personal Information */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <User className="w-5 h-5" />
                                            Personal Information
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Full Name *
                                                </label>
                                                <Field name="fullName" type="text" className="input" placeholder="John Doe" />
                                                <ErrorMessage name="fullName" component="div" className="text-red-600 text-sm mt-1" />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Email Address
                                                </label>
                                                <Field name="email" type="email" className="input" placeholder="john@example.com" />
                                                <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Date of Birth *
                                                </label>
                                                <Field name="dateOfBirth" type="date" className="input" />
                                                <ErrorMessage name="dateOfBirth" component="div" className="text-red-600 text-sm mt-1" />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Gender *
                                                </label>
                                                <Field as="select" name="gender" className="input">
                                                    <option value="">Select Gender</option>
                                                    <option value="MALE">Male</option>
                                                    <option value="FEMALE">Female</option>
                                                    <option value="OTHER">Other</option>
                                                </Field>
                                                <ErrorMessage name="gender" component="div" className="text-red-600 text-sm mt-1" />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Blood Group
                                                </label>
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
                                                <ErrorMessage name="bloodGroup" component="div" className="text-red-600 text-sm mt-1" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address Information */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <Calendar className="w-5 h-5" />
                                            Address Information
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Address *
                                                </label>
                                                <Field name="address" as="textarea" rows="2" className="input" placeholder="Street address" />
                                                <ErrorMessage name="address" component="div" className="text-red-600 text-sm mt-1" />
                                            </div>

                                            <div className="grid md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        City *
                                                    </label>
                                                    <Field name="city" type="text" className="input" placeholder="Mumbai" />
                                                    <ErrorMessage name="city" component="div" className="text-red-600 text-sm mt-1" />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        State *
                                                    </label>
                                                    <Field name="state" type="text" className="input" placeholder="Maharashtra" />
                                                    <ErrorMessage name="state" component="div" className="text-red-600 text-sm mt-1" />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Pincode *
                                                    </label>
                                                    <Field name="pincode" type="text" className="input" placeholder="400001" maxLength="6" />
                                                    <ErrorMessage name="pincode" component="div" className="text-red-600 text-sm mt-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Emergency Contact */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <Phone className="w-5 h-5" />
                                            Emergency Contact
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Contact Name *
                                                </label>
                                                <Field name="emergencyContactName" type="text" className="input" placeholder="Contact person name" />
                                                <ErrorMessage name="emergencyContactName" component="div" className="text-red-600 text-sm mt-1" />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Contact Number *
                                                </label>
                                                <Field name="emergencyContactNumber" type="tel" className="input" placeholder="10-digit number" maxLength="10" />
                                                <ErrorMessage name="emergencyContactNumber" component="div" className="text-red-600 text-sm mt-1" />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || loading}
                                        className="btn btn-primary w-full py-4 text-lg"
                                    >
                                        {isSubmitting || loading ? (
                                            <div className="spinner border-white border-t-transparent w-6 h-6"></div>
                                        ) : (
                                            'Complete Registration'
                                        )}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    )}

                    {/* Login Link */}
                    {step === 'phone' && (
                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <button
                                    onClick={() => navigate('/login/patient')}
                                    className="text-green-600 font-semibold hover:text-green-700"
                                >
                                    Login
                                </button>
                            </p>
                        </div>
                    )}
                </div>

                {/* Development Note */}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 text-center">
                        <strong>Development Mode:</strong> Use OTP <code className="bg-yellow-100 px-2 py-1 rounded">123456</code> for testing
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PatientRegistrationPage;
