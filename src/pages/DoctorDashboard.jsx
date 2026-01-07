import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity, Users, FileText, Calendar,
    Plus, Search, LogOut, Menu, X,
    TrendingUp, Clock, CheckCircle, ChevronRight,
    UserPlus, History, Settings, Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import DoctorSidebar from '../components/DoctorSidebar';

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({
        totalPatients: 0,
        todayVisits: 0,
        pendingFollowups: 0,
        totalPrescriptions: 0,
    });
    const [recentPatients, setRecentPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, patientsRes] = await Promise.all([
                api.get('/doctor/stats'),
                api.get('/doctor/patients/recent'),
            ]);

            setStats(statsRes);
            setRecentPatients(patientsRes);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Active Patients',
            value: stats.totalPatients,
            icon: <Users className="w-6 h-6" />,
            color: 'text-primary',
            bgColor: 'bg-primary-subtle',
            trend: '+12%'
        },
        {
            title: "Today's Appointments",
            value: stats.todayVisits,
            icon: <Calendar className="w-6 h-6" />,
            color: 'text-success',
            bgColor: 'bg-[#dcfce7]',
            trend: '5 Pending'
        },
        {
            title: 'Pending Reviews',
            value: stats.pendingFollowups,
            icon: <Clock className="w-6 h-6" />,
            color: 'text-warning',
            bgColor: 'bg-[#fef3c7]',
            trend: 'Due Today'
        },
        {
            title: 'Total E-Scripts',
            value: stats.totalPrescriptions,
            icon: <FileText className="w-6 h-6" />,
            color: 'text-accent',
            bgColor: 'bg-[#f3e8ff]',
            trend: 'Last 30 days'
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            <DoctorSidebar />

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 overflow-y-auto">
                <header className="h-20 bg-white-80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="hidden md-flex items-center bg-gray-50 rounded-xl px-3 border border-gray-100 focus-within:border-primary focus-within:bg-white transition-all shadow-sm h-10 w-80">
                            <Search className="w-4 h-4 text-gray-400 shrink-0" />
                            <input
                                type="text"
                                placeholder="Search records..."
                                className="w-full bg-transparent border-none py-1 px-3 focus:outline-none text-sm font-medium text-gray-900"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 hover:bg-gray-50 rounded-lg text-gray-400">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <div className="w-px h-8 bg-gray-100"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-900">Dr. {user?.name}</p>
                                <p className="text-xs font-black text-primary uppercase tracking-widest">{user?.specialization || 'Surgeon'}</p>
                            </div>
                            <div className="w-10 h-10 bg-primary-subtle rounded-xl flex items-center justify-center font-bold text-primary border border-primary-10">
                                {user?.name?.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    <div className="flex flex-col md-flex justify-between gap-6 mb-10 slide-up">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 mb-2">Workspace Overview</h1>
                            <p className="text-gray-500 font-medium">Monitoring your practice's performance today</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="btn btn-outline py-2-5">
                                <History className="w-4 h-4" /> Reports
                            </button>
                            <button onClick={() => navigate('/doctor/patients/add')} className="btn btn-primary py-2-5 shadow-xl">
                                <UserPlus className="w-4 h-4" /> New Patient
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid md-grid-cols-2 lg-grid-cols-4 gap-6 mb-10">
                        {statCards.map((stat, idx) => (
                            <div key={idx} className="card p-6 border-none shadow-sm hover:shadow-xl transition-all slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-12 h-12 ${stat.bgColor} ${stat.color} rounded-xl flex items-center justify-center`}>
                                        {stat.icon}
                                    </div>
                                    <span className={`badge ${stat.bgColor} ${stat.color} text-xs`}>
                                        {stat.trend}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.title}</p>
                                <p className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Content Section */}
                    <div className="grid lg-grid-cols-3 gap-8 slide-up" style={{ animationDelay: '400ms' }}>
                        <div className="lg-col-span-2 space-y-8">
                            <div className="card p-0 overflow-hidden border-none shadow-sm">
                                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                                    <h2 className="text-xl font-black text-gray-900">Recent Registrations</h2>
                                    <button
                                        onClick={() => navigate('/doctor/patients')}
                                        className="text-sm font-bold text-primary hover:underline"
                                    >
                                        View All
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Patient Name</th>
                                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Age/Gender</th>
                                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Registered</th>
                                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                                                <th className="px-6 py-4"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {loading ? (
                                                <tr><td colSpan="5" className="p-12 text-center"><div className="spinner mx-auto"></div></td></tr>
                                            ) : recentPatients.length === 0 ? (
                                                <tr><td colSpan="5" className="p-12 text-center text-gray-400 font-bold">No recent patients found</td></tr>
                                            ) : (
                                                recentPatients.map((p) => (
                                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-400 group-hover:bg-primary-subtle group-hover:text-primary transition-colors">
                                                                    {p.fullName?.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-gray-900">{p.fullName}</p>
                                                                    <p className="text-xs text-gray-400">{p.mobile}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 font-bold text-gray-600">{p.age}Y • {p.gender?.charAt(0)}</td>
                                                        <td className="px-6 py-4 font-medium text-gray-400">{p.registeredAt || 'Today'}</td>
                                                        <td className="px-6 py-4"><span className="badge badge-success">Onboarded</span></td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button
                                                                    onClick={() => navigate(`/doctor/consultation/${p.patientId}`)}
                                                                    className="btn btn-primary py-1.5 px-4 text-xs shadow-md"
                                                                >
                                                                    Consult
                                                                </button>
                                                                <button
                                                                    onClick={() => navigate(`/doctor/patients/${p.patientId}`)}
                                                                    className="p-2 hover:bg-white rounded-lg text-gray-300 group-hover:text-primary transition-all"
                                                                >
                                                                    <ChevronRight className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="card medical-grad text-white border-none p-8">
                                <h3 className="text-xl font-black mb-2">Digital Prescription</h3>
                                <p className="text-blue-100 text-sm mb-6 leading-relaxed">Quickly generate AI-powered E-Prescriptions for your patients.</p>
                                <button
                                    onClick={() => navigate('/doctor/patients')}
                                    className="btn bg-white text-primary w-full py-3.5 font-bold shadow-xl"
                                >
                                    Start Session
                                </button>
                            </div>

                            <div className="card border-none shadow-sm">
                                <h3 className="text-lg font-black text-gray-900 mb-4">Upcoming</h3>
                                <div className="flex flex-col gap-4">
                                    {[1, 2, 3].map((_, i) => (
                                        <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex flex-col items-center justify-center shrink-0">
                                                <span className="text-xs font-black text-gray-400">MAY</span>
                                                <span className="text-lg font-black text-gray-900 leading-tight">{10 + i}</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">Patient Review</p>
                                                <p className="text-xs text-gray-400">10:30 AM • Video</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div >
    );
};

export default DoctorDashboard;

