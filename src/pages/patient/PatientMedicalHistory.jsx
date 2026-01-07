import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    History, Search, Filter, ArrowLeft,
    FileText, Calendar, User, Eye, Download,
    Activity, ChevronRight, Clock
} from 'lucide-react';
import api from '../../config/api';
import { format } from 'date-fns';
import PatientSidebar from '../../components/PatientSidebar';

const PatientMedicalHistory = () => {
    const navigate = useNavigate();
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [downloading, setDownloading] = useState({});

    useEffect(() => {
        fetchVisits();
    }, []);

    const fetchVisits = async () => {
        try {
            const data = await api.get('/patient/visits');
            setVisits(data);
        } catch (error) {
            console.error('Failed to fetch visits:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredVisits = visits.filter(v =>
        v.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.chiefComplaint?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.id?.toString().includes(searchTerm)
    );

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
            <PatientSidebar />

            <main className="flex-1 p-8 overflow-y-auto h-screen">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <button
                                onClick={() => navigate('/patient/dashboard')}
                                className="flex items-center gap-2 text-gray-400 font-bold hover:text-primary mb-2 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                            </button>
                            <h1 className="text-3xl font-black text-gray-900">Your Medical History</h1>
                            <p className="text-gray-500 font-medium">Complete record of your clinical consultations and prescriptions</p>
                        </div>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm mb-8 flex gap-4">
                        <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 border border-transparent focus-within:border-primary focus-within:bg-white transition-all h-12">
                            <Search className="text-gray-400 w-5 h-5 shrink-0" />
                            <input
                                type="text"
                                placeholder="Search by doctor name, complaint, or visit ID..."
                                className="w-full bg-transparent border-none py-2 px-3 focus:outline-none font-bold text-gray-900"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Visits List */}
                    <div className="card p-0 overflow-hidden border-none shadow-sm bg-white rounded-3xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Visit Info</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Consulting Doctor</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Chief Complaint</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {loading ? (
                                        <tr><td colSpan="4" className="p-20 text-center"><div className="spinner mx-auto"></div></td></tr>
                                    ) : filteredVisits.length === 0 ? (
                                        <tr><td colSpan="4" className="p-20 text-center text-gray-400 font-bold italic">No medical records found matches your search.</td></tr>
                                    ) : (
                                        filteredVisits.map((v) => (
                                            <tr key={v.id} className="hover:bg-gray-50/50 transition-colors group border-b border-gray-50 last:border-0">
                                                <td className="px-8 py-6">
                                                    <p className="font-black text-primary mb-1">Visit #{v.id}</p>
                                                    <p className="text-gray-400 font-bold flex items-center gap-1.5 text-xs">
                                                        <Calendar className="w-3.5 h-3.5" /> {format(new Date(v.visitDate), 'MMMM dd, yyyy')}
                                                    </p>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-primary-subtle rounded-2xl flex items-center justify-center font-black text-primary group-hover:scale-110 transition-transform">
                                                            {v.doctorName?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-gray-900 leading-none mb-1">Dr. {v.doctorName}</p>
                                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Specialist</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <p className="font-bold text-gray-700 max-w-xs">{v.chiefComplaint}</p>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <button
                                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-500 rounded-xl hover:bg-primary-subtle hover:text-primary transition-all font-black text-[10px] uppercase tracking-widest shadow-sm"
                                                            onClick={() => navigate(`/patient/visit/${v.id}`)}
                                                        >
                                                            <Eye className="w-4 h-4" /> View Details
                                                        </button>
                                                        <button
                                                            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest shadow-sm ${downloading[v.id] ? 'bg-primary-subtle text-primary border-primary' : 'bg-primary text-white hover:bg-primary-dark shadow-primary/20'}`}
                                                            onClick={() => handleDownloadPdf(v.id)}
                                                            disabled={downloading[v.id]}
                                                        >
                                                            {downloading[v.id] ? (
                                                                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                                            ) : (
                                                                <><Download className="w-4 h-4" /> Prescription</>
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

export default PatientMedicalHistory;
