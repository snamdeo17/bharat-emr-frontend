import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    History, Search, Filter, ArrowLeft,
    FileText, Calendar, User, Eye, Download,
    Activity, ChevronRight, Clock, Edit2
} from 'lucide-react';
import api from '../../config/api';
import { format } from 'date-fns';

import DoctorSidebar from '../../components/DoctorSidebar';

const MedicalHistory = () => {
    const navigate = useNavigate();
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchVisits();
    }, []);

    const fetchVisits = async () => {
        try {
            const data = await api.get('/doctor/visits');
            setVisits(data);
        } catch (error) {
            console.error('Failed to fetch visits:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredVisits = visits.filter(v =>
        v.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.chiefComplaint?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.id?.toString().includes(searchTerm)
    );

    const [downloading, setDownloading] = useState({});

    const handleDownloadPdf = async (visitId) => {
        setDownloading(prev => ({ ...prev, [visitId]: true }));
        try {
            const response = await api.get(`/visits/${visitId}/prescription/pdf`, {
                responseType: 'blob'
            });

            const blob = new Blob([response], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `prescription_${visitId}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to download PDF:', error);
            alert('Failed to download PDF. Please try again.');
        } finally {
            setDownloading(prev => ({ ...prev, [visitId]: false }));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <DoctorSidebar />

            <main className="flex-1 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <button
                                onClick={() => navigate('/doctor/dashboard')}
                                className="flex items-center gap-2 text-gray-400 font-bold hover:text-primary mb-2 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                            </button>
                            <h1 className="text-3xl font-black text-gray-900">Medical History Log</h1>
                            <p className="text-gray-500 font-medium">Archive of all clinical consultations recorded by you</p>
                        </div>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm mb-8 flex gap-4">
                        <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 border border-transparent focus-within:border-primary focus-within:bg-white transition-all h-12">
                            <Search className="text-gray-400 w-5 h-5 shrink-0" />
                            <input
                                type="text"
                                placeholder="Search by patient name, complaint, or visit ID..."
                                className="w-full bg-transparent border-none py-2 px-3 focus:outline-none font-bold text-gray-900"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="btn btn-outline h-12 px-6">
                            <Filter className="w-5 h-5" /> Filter Date
                        </button>
                    </div>

                    {/* Visits List */}
                    <div className="card p-0 overflow-hidden border-none shadow-sm bg-white">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Visit ID / Date</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Patient Details</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Chief Complaint</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Digital Prescription</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {loading ? (
                                        <tr><td colSpan="5" className="p-20 text-center"><div className="spinner mx-auto"></div></td></tr>
                                    ) : filteredVisits.length === 0 ? (
                                        <tr><td colSpan="5" className="p-20 text-center text-gray-400 font-bold">No visit records found</td></tr>
                                    ) : (
                                        filteredVisits.map((v) => (
                                            <tr key={v.id} className="hover:bg-gray-50 transition-colors group border-b border-gray-50 last:border-0">
                                                <td className="px-6 py-5">
                                                    <p className="font-black text-primary mb-1">#{v.id}</p>
                                                    <p className="text-gray-400 font-bold flex items-center gap-1 text-xs">
                                                        <Calendar className="w-3 h-3" /> {format(new Date(v.visitDate), 'MMM dd, yyyy')}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center font-black text-gray-400 group-hover:bg-primary-subtle group-hover:text-primary transition-all">
                                                            {v.patientName?.charAt(0)}
                                                        </div>
                                                        <p className="font-bold text-gray-900">{v.patientName}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <p className="font-bold text-gray-700 max-w-xs truncate">{v.chiefComplaint}</p>
                                                    <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full font-black text-gray-400 uppercase tracking-tighter">Consultation</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        {v.medicines?.length > 0 ? (
                                                            <span className="badge badge-success text-[10px] py-1">Prescription Generated</span>
                                                        ) : (
                                                            <span className="badge badge-primary text-[10px] py-1">Tests Only</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-primary-subtle hover:text-primary transition-all shadow-sm"
                                                            title="View Case Details"
                                                            onClick={() => navigate(`/doctor/visit/${v.id}`)}
                                                        >
                                                            <Eye className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-primary-subtle hover:text-primary transition-all shadow-sm"
                                                            title="Edit Record"
                                                            onClick={() => navigate(`/doctor/consultation/edit/${v.id}`)}
                                                        >
                                                            <Edit2 className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            className={`p-2 rounded-lg transition-all shadow-sm ${downloading[v.id] ? 'bg-primary-subtle text-primary' : 'bg-gray-50 text-gray-400 hover:bg-primary-subtle hover:text-primary'}`}
                                                            title="Download PDF"
                                                            onClick={() => handleDownloadPdf(v.id)}
                                                            disabled={downloading[v.id]}
                                                        >
                                                            {downloading[v.id] ? (
                                                                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                                            ) : (
                                                                <Download className="w-5 h-5" />
                                                            )}
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

export default MedicalHistory;
