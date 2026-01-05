import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity, FileText, Calendar, User,
    LogOut, Download, Eye, Clock,
    Shield, Search, Bell, History, ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import { format } from 'date-fns';

const PatientDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [visits, setVisits] = useState([]);
    const [upcomingFollowups, setUpcomingFollowups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [visitsRes, followupsRes] = await Promise.all([
                api.get('/patient/visits'),
                api.get('/patient/followups/upcoming'),
            ]);

            setVisits(visitsRes);
            setUpcomingFollowups(followupsRes);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Minimal Sidebar for Patient */}
            <aside className="w-20 bg-white border-r border-gray-100 flex flex-col items-center py-6 gap-8 h-screen sticky top-0 flex-shrink-0">
                <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl shadow-lg">
                    <Activity className="text-white w-6 h-6" />
                </div>
                <div className="flex flex-col gap-4">
                    <button className="p-3 bg-primary text-white rounded-xl shadow-md"><Activity className="w-6 h-6" /></button>
                    <button className="p-3 text-gray-400 hover:bg-gray-50 rounded-xl"><History className="w-6 h-6" /></button>
                    <button className="p-3 text-gray-400 hover:bg-gray-50 rounded-xl"><Calendar className="w-6 h-6" /></button>
                </div>
                <button onClick={logout} className="mt-auto p-3 text-red-500 hover:bg-red-50 rounded-xl"><LogOut className="w-6 h-6" /></button>
            </aside>

            <main className="flex-1 min-w-0 overflow-y-auto">
                <header className="h-20 bg-white-80 backdrop-blur-md border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-40">
                    <h2 className="text-xl font-black text-gray-900">Health Portal</h2>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                                <p className="text-xs font-black text-primary uppercase tracking-widest leading-none">Verified Patient</p>
                            </div>
                            <div className="w-10 h-10 bg-primary-subtle rounded-full flex items-center justify-center font-bold text-primary border border-primary-10">
                                {user?.name?.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-5xl mx-auto">
                    {/* Welcome Banner */}
                    <div className="medical-grad p-10 rounded-2xl text-white mb-10 relative overflow-hidden slide-up shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white border-white-40 rounded-full -mr-20 -mt-20 blur-3xl opacity-10"></div>
                        <div className="relative z-10">
                            <h1 className="text-4xl font-black mb-3">Hello, {user?.name}!</h1>
                            <p className="text-blue-100 font-medium text-lg max-w-md">Your health dashboard is up to date. You have {upcomingFollowups.length} scheduled follow-ups.</p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid md-grid-cols-3 gap-6 mb-12 slide-up" style={{ animationDelay: '100ms' }}>
                        <div className="card p-6 border-none shadow-sm flex items-center gap-6">
                            <div className="w-14 h-14 bg-primary-subtle text-primary rounded-2xl flex items-center justify-center flex-shrink-0">
                                <FileText className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Visits</p>
                                <p className="text-2xl font-black text-gray-900">{visits.length}</p>
                            </div>
                        </div>
                        <div className="card p-6 border-none shadow-sm flex items-center gap-6">
                            <div className="w-14 h-14 bg-[#dcfce7] text-success rounded-2xl flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Upcoming</p>
                                <p className="text-2xl font-black text-gray-900">{upcomingFollowups.length}</p>
                            </div>
                        </div>
                        <div className="card p-6 border-none shadow-sm flex items-center gap-6">
                            <div className="w-14 h-14 bg-[#fef3c7] text-warning rounded-2xl flex items-center justify-center flex-shrink-0">
                                <Clock className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Last Visit</p>
                                <p className="text-sm font-black text-gray-900">
                                    {visits[0] ? format(new Date(visits[0].visitDate), 'MMM dd, yyyy') : 'No records'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="grid lg-grid-cols-3 gap-10 slide-up" style={{ animationDelay: '200ms' }}>
                        <div className="lg-col-span-2">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-black text-gray-900">Recent Medical Visits</h3>
                                <button className="text-primary font-bold text-sm hover:underline">View History</button>
                            </div>

                            {loading ? (
                                <div className="p-20 text-center"><div className="spinner mx-auto"></div></div>
                            ) : visits.length === 0 ? (
                                <div className="card p-20 text-center border-dashed">
                                    <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-400 font-bold">No medical records found yet.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {visits.map((visit) => (
                                        <div key={visit.id} className="card p-6 hover:border-primary transition-all group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <span className="badge badge-primary mb-2 inline-block">General Consultation</span>
                                                    <h4 className="text-lg font-black text-gray-900">Dr. {visit.doctorName}</h4>
                                                    <p className="text-gray-400 text-sm font-medium">{format(new Date(visit.visitDate), 'MMMM dd, yyyy')}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="badge badge-success">Completed</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-50">
                                                <button onClick={() => navigate(`/patient/visits/${visit.id}`)} className="btn btn-outline py-2 text-sm flex-1">
                                                    <Eye className="w-4 h-4" /> View Case
                                                </button>
                                                <button className="btn btn-primary py-2 text-sm flex-1">
                                                    <Download className="w-4 h-4" /> E-Prescription
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-8">
                            <div className="card border-none shadow-sm p-6">
                                <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-primary" /> Health Reminders
                                </h3>
                                {upcomingFollowups.length === 0 ? (
                                    <p className="text-gray-400 text-sm font-medium">No upcoming follow-ups scheduled.</p>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        {upcomingFollowups.map((f) => (
                                            <div key={f.id} className="bg-blue-50 p-4 rounded-xl border border-primary-10">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Calendar className="w-4 h-4 text-primary" />
                                                    <span className="text-sm font-bold text-primary">{format(new Date(f.followupDate), 'MMM dd')}</span>
                                                </div>
                                                <p className="font-bold text-gray-900">Dr. {f.doctorName}</p>
                                                <p className="text-xs text-gray-500 mt-1">Check-up appointment</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="card glass p-6">
                                <h4 className="font-black text-gray-900 mb-2">Need Support?</h4>
                                <p className="text-gray-500 text-sm mb-4 leading-relaxed">Our clinical support team is available 24/7 for your assistance.</p>
                                <button className="btn btn-primary w-full text-xs py-3">Contact Helpdesk</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PatientDashboard;

