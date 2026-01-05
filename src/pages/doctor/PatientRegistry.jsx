import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, Search, ArrowLeft, ChevronRight,
    Filter, Plus, UserPlus, Phone, Activity
} from 'lucide-react';
import api from '../../config/api';

const PatientRegistry = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const data = await api.get('/doctor/patients');
            setPatients(data);
        } catch (error) {
            console.error('Failed to fetch patients:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPatients = patients.filter(p =>
        p.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.mobile?.includes(searchTerm) ||
        p.patientId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar Mockup (Shortened for brevity) */}
            <div className="w-20 bg-white border-r border-gray-100 flex flex-col items-center py-6 gap-8 h-screen sticky top-0">
                <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl" onClick={() => navigate('/doctor/dashboard')}>
                    <Activity className="text-white w-6 h-6 cursor-pointer" />
                </div>
            </div>

            <main className="flex-1 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md-flex justify-between items-start md-items-center gap-6 mb-10">
                        <div>
                            <button
                                onClick={() => navigate('/doctor/dashboard')}
                                className="flex items-center gap-2 text-gray-400 font-bold hover:text-primary mb-2 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                            </button>
                            <h1 className="text-3xl font-black text-gray-900">Patient Registry</h1>
                            <p className="text-gray-500 font-medium">Manage and view all registered patients</p>
                        </div>
                        <button
                            onClick={() => navigate('/doctor/patients/add')}
                            className="btn btn-primary shadow-xl px-8"
                        >
                            <UserPlus className="w-5 h-5" /> Onboard New Patient
                        </button>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm mb-8 flex flex-col md-flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name, ID or mobile number..."
                                className="input pl-12 h-12"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="btn btn-outline h-12 px-6">
                            <Filter className="w-5 h-5" /> Filters
                        </button>
                    </div>

                    {/* Patients Grid/Table */}
                    <div className="card p-0 overflow-hidden border-none shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Patient Details</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">ID</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Age/Gender</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Last Visit</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {loading ? (
                                        <tr><td colSpan="5" className="p-20 text-center"><div className="spinner mx-auto"></div></td></tr>
                                    ) : filteredPatients.length === 0 ? (
                                        <tr><td colSpan="5" className="p-20 text-center text-gray-400 font-bold">No patients found</td></tr>
                                    ) : (
                                        filteredPatients.map((p) => (
                                            <tr key={p.id} className="hover:bg-gray-50 transition-colors group border-b border-gray-50 last:border-0">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-11 h-11 bg-primary-subtle text-primary rounded-xl flex items-center justify-center font-black text-lg">
                                                            {p.fullName?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 text-base">{p.fullName}</p>
                                                            <div className="flex items-center gap-1 text-gray-400 font-medium">
                                                                <Phone className="w-3 h-3" /> {p.mobile}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 font-bold text-primary">{p.patientId}</td>
                                                <td className="px-6 py-5 font-bold text-gray-600">{p.age}Y • {p.gender}</td>
                                                <td className="px-6 py-5 font-medium text-gray-400">{p.lastVisitDate || 'Never'}</td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <button
                                                            onClick={() => navigate(`/doctor/consultation/${p.id}`)}
                                                            className="btn btn-primary py-2 px-5 text-sm"
                                                        >
                                                            Start Visit
                                                        </button>
                                                        <button
                                                            onClick={() => navigate(`/doctor/patients/${p.id}`)}
                                                            className="p-2 text-gray-300 hover:text-primary transition-colors hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-gray-100"
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
            </main>
        </div>
    );
};

export default PatientRegistry;
