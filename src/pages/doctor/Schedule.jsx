import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar, Clock, User, Phone,
    ChevronRight, ArrowLeft, Filter, Search,
    Activity, CheckCircle, XCircle
} from 'lucide-react';
import api from '../../config/api';
import { format } from 'date-fns';

import DoctorSidebar from '../../components/DoctorSidebar';

const Schedule = () => {
    const navigate = useNavigate();
    const [followUps, setFollowUps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('ALL'); // ALL, SCHEDULED, COMPLETED, CANCELLED

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        try {
            const data = await api.get('/doctor/followups');
            setFollowUps(data);
        } catch (error) {
            console.error('Failed to fetch schedule:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.put(`/doctor/followups/${id}/status`, null, {
                params: { status }
            });
            fetchSchedule(); // Refresh
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const filteredFollowUps = followUps.filter(f => {
        const matchesSearch = f.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.notes?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'ALL' || f.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <DoctorSidebar />

            <main className="flex-1 p-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <button
                                onClick={() => navigate('/doctor/dashboard')}
                                className="flex items-center gap-2 text-gray-400 font-bold hover:text-primary mb-2 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                            </button>
                            <h1 className="text-3xl font-black text-gray-900">Dr. Appointment Schedule</h1>
                            <p className="text-gray-500 font-medium">Manage your follow-ups and upcoming consultations</p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="grid md:grid-cols-4 gap-4 mb-8">
                        <div className="md:col-span-2 flex items-center bg-white rounded-xl px-4 shadow-sm border border-transparent focus-within:border-primary transition-all h-12">
                            <Search className="text-gray-400 w-5 h-5 shrink-0" />
                            <input
                                type="text"
                                placeholder="Search patients or notes..."
                                className="w-full bg-transparent border-none py-2 px-3 focus:outline-none font-bold text-gray-900"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-2 flex gap-2">
                            {['ALL', 'SCHEDULED', 'COMPLETED'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`flex-1 px-4 py-2 rounded-xl font-bold text-sm transition-all ${filter === f
                                        ? 'bg-primary text-white shadow-md'
                                        : 'bg-white text-gray-400 hover:bg-gray-100'
                                        }`}
                                >
                                    {f.charAt(0) + f.slice(1).toLowerCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Timeline / List */}
                    {loading ? (
                        <div className="p-20 text-center"><div className="spinner mx-auto"></div></div>
                    ) : filteredFollowUps.length === 0 ? (
                        <div className="card p-20 text-center border-dashed bg-white border-2 border-gray-100">
                            <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-400 font-bold text-xl">No appointments found</p>
                            <p className="text-gray-400 mt-1">Scheduled follow-ups will appear here</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredFollowUps.map((f) => (
                                <div key={f.id} className="card p-6 bg-white border-none shadow-sm hover:shadow-md transition-all group">
                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                        <div className="flex gap-6">
                                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex flex-col items-center justify-center text-primary flex-shrink-0">
                                                <span className="text-xs font-black uppercase">{format(new Date(f.scheduledDate), 'MMM')}</span>
                                                <span className="text-xl font-black">{format(new Date(f.scheduledDate), 'dd')}</span>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-gray-900 mb-1">{f.patientName}</h3>
                                                <div className="flex items-center gap-4 text-sm font-bold text-gray-400">
                                                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {format(new Date(f.scheduledDate), 'hh:mm a')}</span>
                                                    <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {f.patientMobile}</span>
                                                </div>
                                                {f.notes && (
                                                    <p className="mt-3 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                        <span className="font-bold text-gray-400 mr-2">Notes:</span> {f.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-row md:flex-col justify-between items-end gap-3">
                                            <span className={`badge ${f.status === 'COMPLETED' ? 'badge-success' :
                                                f.status === 'CANCELLED' ? 'badge-error' : 'badge-primary'
                                                }`}>
                                                {f.status}
                                            </span>

                                            {f.status === 'SCHEDULED' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleUpdateStatus(f.id, 'COMPLETED')}
                                                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                                        title="Mark as Completed"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(f.id, 'CANCELLED')}
                                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                        title="Cancel Appointment"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/doctor/consultation/${f.patientId}`)}
                                                        className="btn btn-primary px-4 py-2 text-xs"
                                                    >
                                                        Start Visit
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Schedule;
