import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    History, Search, Filter, ArrowLeft,
    FileText, Calendar, User, Eye, Download,
    Activity, ChevronRight, Clock, Edit2,
    ChevronUp, ChevronDown, ChevronLeft, X
} from 'lucide-react';
import api from '../../config/api';
import { format } from 'date-fns';

import DoctorSidebar from '../../components/DoctorSidebar';

const MedicalHistory = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // UI State
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        totalElements: 0,
        totalPages: 0,
        page: 1,
        size: 10
    });
    const [localSearch, setLocalSearch] = useState('');

    // Helper to get params from URL
    const getParam = (key, defaultValue) => searchParams.get(key) || defaultValue;

    // Derived State from URL
    const page = parseInt(getParam('page', '1'));
    const size = parseInt(getParam('size', '10'));
    const sortBy = getParam('sortBy', 'visitDate');
    const sortDir = getParam('sortDir', 'desc');
    const search = getParam('search', '');
    const visitFrom = getParam('visitFrom', '');
    const visitTo = getParam('visitTo', '');

    const fetchVisits = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page,
                size,
                sortBy,
                sortDir,
                search: search || undefined,
                visitFrom: visitFrom || undefined,
                visitTo: visitTo || undefined
            };

            const response = await api.get('/visits', { params });
            // API returns ApiResponse<PaginatedResponse<VisitDto>>
            setVisits(response.data);
            setPagination({
                totalElements: response.totalElements,
                totalPages: response.totalPages,
                page: response.page,
                size: response.size
            });
        } catch (error) {
            console.error('Failed to fetch visits:', error);
        } finally {
            setLoading(false);
        }
    }, [page, size, sortBy, sortDir, search, visitFrom, visitTo]);

    useEffect(() => {
        fetchVisits();
    }, [fetchVisits]);

    useEffect(() => {
        setLocalSearch(search);
    }, [search]);

    const updateParams = (newParams) => {
        const updated = new URLSearchParams(searchParams);
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === undefined || value === null || value === '') {
                updated.delete(key);
            } else {
                updated.set(key, value);
            }
        });
        // Reset to page 1 on filter/sort change unless specifically changing page
        if (!newParams.page && page !== 1) {
            updated.set('page', '1');
        }
        setSearchParams(updated);
    };

    const handleSort = (field) => {
        const dir = sortBy === field && sortDir === 'asc' ? 'desc' : 'asc';
        updateParams({ sortBy: field, sortDir: dir });
    };

    const SortIcon = ({ field }) => {
        const isActive = sortBy === field;
        return (
            <div className={`flex flex-col -gap-1 transition-all duration-300 ${isActive ? 'opacity-100 scale-110' : 'opacity-20 group-hover:opacity-50'}`}>
                <ChevronUp className={`w-2.5 h-2.5 ${isActive && sortDir === 'asc' ? 'text-primary' : 'text-gray-400'}`} />
                <ChevronDown className={`w-2.5 h-2.5 ${isActive && sortDir === 'desc' ? 'text-primary' : 'text-gray-400'}`} />
            </div>
        );
    };

    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        updateParams({ search: localSearch });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        }
    };

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

            <main className="flex-1 p-8 min-w-0">
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
                    <div className="bg-white p-4 rounded-2xl shadow-sm mb-8 flex flex-col md:flex-row gap-4">
                        <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 border border-transparent focus-within:border-primary focus-within:bg-white transition-all h-12">
                            <Search className="text-gray-400 w-5 h-5 shrink-0" />
                            <input
                                type="text"
                                placeholder="Search by patient, complaint, ID..."
                                className="w-full bg-transparent border-none py-2 px-3 focus:outline-none font-bold text-gray-900"
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            {localSearch && (
                                <button
                                    onClick={() => {
                                        setLocalSearch('');
                                        updateParams({ search: '' });
                                    }}
                                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-400" />
                                </button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleSearchSubmit}
                                className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                            >
                                Search
                            </button>
                            <button className="btn btn-outline h-12 px-6">
                                <Filter theme="outline" className="w-5 h-5" /> Filter Date
                            </button>
                        </div>
                    </div>

                    {/* Visits List */}
                    <div className="card p-0 overflow-hidden border-none shadow-sm bg-white mb-8">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-4">
                                            <button
                                                onClick={() => handleSort('id')}
                                                className={`group flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 ${sortBy === 'id' ? 'bg-primary/5 ring-1 ring-primary/10' : 'hover:bg-gray-50'}`}
                                            >
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${sortBy === 'id' ? 'text-primary' : 'text-gray-400'}`}>Visit ID / Date</span>
                                                <SortIcon field="id" />
                                            </button>
                                        </th>
                                        <th className="px-6 py-4">
                                            <button
                                                onClick={() => handleSort('patient.fullName')}
                                                className={`group flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 ${sortBy === 'patient.fullName' ? 'bg-primary/5 ring-1 ring-primary/10' : 'hover:bg-gray-50'}`}
                                            >
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${sortBy === 'patient.fullName' ? 'text-primary' : 'text-gray-400'}`}>Patient Details</span>
                                                <SortIcon field="patient.fullName" />
                                            </button>
                                        </th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Chief Complaint</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Digital Prescription</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {loading ? (
                                        <tr><td colSpan="5" className="p-20 text-center"><div className="spinner mx-auto"></div></td></tr>
                                    ) : visits.length === 0 ? (
                                        <tr><td colSpan="5" className="p-20 text-center text-gray-400 font-bold">No visit records found</td></tr>
                                    ) : (
                                        visits.map((v) => (
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
                                                    <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full font-black text-gray-400 uppercase tracking-tighter text-muted">Consultation</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center justify-center gap-2">
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

                    {/* Footer Controls */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Show</span>
                                <select
                                    value={size}
                                    onChange={(e) => updateParams({ size: e.target.value, page: 1 })}
                                    className="bg-white border border-gray-100 rounded-lg px-3 py-1.5 text-xs font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    {[10, 25, 50, 100].map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                Showing <span className="text-gray-900">{visits.length}</span> of <span className="text-gray-900">{pagination.totalElements}</span> logs
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => updateParams({ page: page - 1 })}
                                disabled={page === 1}
                                className="p-2 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-primary disabled:opacity-30 disabled:hover:text-gray-400 transition-all shadow-sm"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-1">
                                {[...Array(pagination.totalPages)].map((_, i) => {
                                    const p = i + 1;
                                    // Logic to show limited page numbers if too many
                                    if (pagination.totalPages > 7) {
                                        if (p !== 1 && p !== pagination.totalPages && Math.abs(p - page) > 1) {
                                            if (Math.abs(p - page) === 2) return <span key={p} className="px-1 text-gray-300">...</span>;
                                            return null;
                                        }
                                    }
                                    return (
                                        <button
                                            key={p}
                                            onClick={() => updateParams({ page: p })}
                                            className={`w-9 h-9 rounded-xl font-black text-xs transition-all ${page === p ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-100'}`}
                                        >
                                            {p}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => updateParams({ page: page + 1 })}
                                disabled={page === pagination.totalPages || pagination.totalPages === 0}
                                className="p-2 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-primary disabled:opacity-30 disabled:hover:text-gray-400 transition-all shadow-sm"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MedicalHistory;
