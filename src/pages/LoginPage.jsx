import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Activity, ArrowLeft, Phone, Lock, ChevronRight, Shield } from 'lucide-react';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const { userType } = useParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    const [step, setStep] = useState('phone'); // 'phone' or 'otp'
    const [mobileNumber, setMobileNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isDoctor = userType === 'doctor';

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
                purpose: 'LOGIN',
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
            const result = await login(`+91${mobileNumber}`, otp, isDoctor ? 'DOCTOR' : 'PATIENT');

            if (result.success) {
                const dashboardPath = isDoctor ? '/doctor/dashboard' : '/patient/dashboard';
                window.location.href = dashboardPath;
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#f8fafc] via-[#eff6ff] to-[#f8fafc] relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-glow rounded-full blur-[120px] opacity-20 -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400 rounded-full blur-[120px] opacity-10 -ml-64 -mb-64"></div>

            <div className="w-full max-w-lg relative z-10">
                <button
                    onClick={() => step === 'otp' ? setStep('phone') : navigate('/')}
                    className="btn btn-ghost mb-8 hover:bg-white backdrop-blur-sm group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </button>

                <div className="card glass border-white-40 shadow-2xl p-8 md:p-12 animate-in fade-in duration-500">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl mb-6 shadow-xl rotate-3">
                            <Activity className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                            {isDoctor ? 'Doctor Access' : 'Patient Portal'}
                        </h1>
                        <p className="text-gray-500 font-medium">
                            {step === 'phone'
                                ? 'Secure login via mobile verification'
                                : 'Enter the 6-digit code sent to your phone'}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-8 text-sm font-semibold flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                            {error}
                        </div>
                    )}

                    {step === 'phone' && (
                        <form onSubmit={handleSendOTP} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                                    Mobile Number
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Phone className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <div className="absolute inset-y-0 left-12 flex items-center pointer-events-none">
                                        <span className="text-gray-400 font-bold border-r border-gray-200 pr-3">+91</span>
                                    </div>
                                    <input
                                        type="tel"
                                        className="input pl-24 h-14 text-lg font-semibold"
                                        placeholder="00000 00000"
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
                                className="btn btn-primary w-full h-14 text-lg font-bold"
                            >
                                {loading ? <div className="spinner border-white w-6 h-6"></div> : <>Send OTP <ChevronRight className="w-5 h-5" /></>}
                            </button>
                        </form>
                    )}

                    {step === 'otp' && (
                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 text-center">
                                    One-Time Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="input pl-12 h-16 text-center text-3xl tracking-[1rem] font-black placeholder:tracking-normal placeholder:text-gray-200"
                                        placeholder="......"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        maxLength={6}
                                        required
                                    />
                                </div>
                                <div className="flex justify-between items-center mt-4 px-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        Sent to +91 {mobileNumber}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setStep('phone')}
                                        className="text-xs font-bold text-primary hover:underline underline-offset-4"
                                    >
                                        Change Number
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || otp.length !== 6}
                                className="btn btn-primary w-full h-14 text-lg font-bold"
                            >
                                {loading ? <div className="spinner border-white w-6 h-6"></div> : 'Verify & Sign In'}
                            </button>

                            <button
                                type="button"
                                onClick={handleSendOTP}
                                disabled={loading}
                                className="btn btn-ghost w-full font-bold text-sm"
                            >
                                Didn't receive code? Resend
                            </button>
                        </form>
                    )}

                    {isDoctor && step === 'phone' && (
                        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                            <p className="text-gray-500 font-medium">
                                New to Bharat EMR?{' '}
                                <button
                                    onClick={() => navigate('/register/doctor')}
                                    className="text-primary font-bold hover:underline underline-offset-4"
                                >
                                    Register as Doctor
                                </button>
                            </p>
                        </div>
                    )}
                </div>

                {/* Secure Trust Badge */}
                <div className="mt-8 flex items-center justify-center gap-4 text-gray-400">
                    <div className="flex items-center gap-1">
                        <Shield className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Secure 256-bit SSL</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <div className="text-[10px] font-bold uppercase tracking-widest">HIPAA Compliant</div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

