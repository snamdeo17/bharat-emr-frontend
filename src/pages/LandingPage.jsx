import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Users, FileText, Calendar, Shield, Zap, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <Activity />,
            title: 'Digital Prescriptions',
            description: 'Create and manage prescriptions digitally with intelligent drug suggestions.',
        },
        {
            icon: <Users />,
            title: 'Patient Management',
            description: 'Comprehensive patient records with exhaustive medical history tracking.',
        },
        {
            icon: <FileText />,
            title: 'Medical Records',
            description: 'Secure, cloud-based storage for all your medical documents and lab reports.',
        },
        {
            icon: <Calendar />,
            title: 'Smart Scheduling',
            description: 'Automated appointment booking and intelligent follow-up reminders.',
        },
        {
            icon: <Shield />,
            title: 'Enterprise Security',
            description: 'Bank-grade encryption and HIPAA compliant data protection protocols.',
        },
        {
            icon: <Zap />,
            title: 'Rapid Workflow',
            description: 'Optimized interfaces designed to reduce administrative overhead by 40%.',
        },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            {/* Premium Navigation */}
            <nav className="glass sticky top-0 z-50 py-4">
                <div className="container flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl shadow-lg">
                            <Activity className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-gray-900">Bharat EMR</span>
                    </div>
                    <div className="hidden md:flex gap-8 items-center">
                        <a href="#features" className="text-sm font-semibold text-gray-600 hover:text-primary">Features</a>
                        <a href="#about" className="text-sm font-semibold text-gray-600 hover:text-primary">About</a>
                        <button
                            onClick={() => navigate('/login/doctor')}
                            className="btn btn-primary shadow-lg"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-50 to-white">
                <div className="container">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="slide-up">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6 border border-blue-200">
                                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                                <span className="text-xs font-bold text-blue-800 uppercase tracking-widest">Next-Gen Healthcare</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-[1.1]">
                                Elevate Your <br />
                                <span className="text-primary italic">Medical Practice</span>
                            </h1>
                            <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-lg">
                                Experience India's most advanced Electronic Medical Records platform.
                                Designed by doctors, for doctors who demand excellence.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => navigate('/login/doctor')}
                                    className="btn btn-primary px-8 py-4 text-lg"
                                >
                                    Doctor Login <ArrowRight className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => navigate('/login/patient')}
                                    className="btn btn-outline px-8 py-4 text-lg"
                                >
                                    Patient Portal
                                </button>
                            </div>
                        </div>
                        <div className="relative slide-up" style={{ animationDelay: '200ms' }}>
                            <div className="absolute -inset-4 bg-primary-glow rounded-[2rem] blur-3xl opacity-20 transform rotate-6"></div>
                            <div className="card p-0 overflow-hidden rounded-[2rem] border-8 border-white shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                                <img
                                    src="medical_hero_banner_1767533481031.png"
                                    alt="Medical Dashboard"
                                    className="w-full h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-20 bg-white">
                <div className="container">
                    <div className="text-center mb-20 slide-up">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Precision Tools for Modern Care</h2>
                        <div className="w-24 h-1.5 bg-primary mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="card slide-up hover:border-primary"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="w-14 h-14 bg-primary-subtle rounded-2xl flex items-center justify-center text-primary mb-6">
                                    {React.cloneElement(feature.icon, { className: 'w-7 h-7' })}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-20">
                <div className="container">
                    <div className="card medical-grad p-12 md:p-20 text-center text-white rounded-[3rem] overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white-10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-extrabold mb-8 text-white">Join the Future of Digital Health</h2>
                            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto font-medium">
                                Thousands of healthcare leaders are already transforming their practices. Are you ready?
                            </p>
                            <button
                                onClick={() => navigate('/login/doctor')}
                                className="btn bg-white text-primary hover:bg-blue-50 px-12 py-5 text-xl shadow-2xl font-bold rounded-2xl"
                            >
                                Start Your Free Trial
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-gray-50 border-t border-gray-200">
                <div className="container">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-2">
                            <Activity className="text-primary w-6 h-6" />
                            <span className="text-xl font-bold text-gray-900">Bharat EMR</span>
                        </div>
                        <p className="text-gray-500 text-sm">
                            &copy; 2026 Bharat EMR. Empowering Healthcare through Technology.
                        </p>
                        <div className="flex gap-6">
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">Twitter</a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">LinkedIn</a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">Terms</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

