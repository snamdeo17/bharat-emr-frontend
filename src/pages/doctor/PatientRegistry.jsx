import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Users, Search, ArrowLeft, ChevronRight, ChevronLeft, ChevronUp, ChevronDown,
    Filter, Plus, UserPlus, Phone, Activity,
    SlidersHorizontal, X, Calendar,
    User, CheckCircle2, AlertCircle, MoreHorizontal
} from 'lucide-react';
import api from '../../config/api';
import { format } from 'date-fns';
import DoctorSidebar from '../../components/DoctorSidebar';

const PatientRegistry = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // UI State
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
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
    const sortBy = getParam('sortBy', 'createdAt');
    const sortDir = getParam('sortDir', 'desc');
    const search = getParam('search', '');
    const gender = getParam('gender', '');
    const minAge = getParam('minAge', '');
    const maxAge = getParam('maxAge', '');
    const doctorId = getParam('doctorId', '');
    const isActive = getParam('isActive', '');
    const createdFrom = getParam('createdFrom', '');
    const createdTo = getParam('createdTo', '');

    const fetchPatients = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page,
                size,
                sortBy,
                sortDir,
                search: search || undefined,
                gender: gender || undefined,
                minAge: minAge || undefined,
                maxAge: maxAge || undefined,
                doctorId: doctorId || undefined,
                isActive: isActive === '' ? undefined : isActive === 'true',
                createdFrom: createdFrom || undefined,
                createdTo: createdTo || undefined
            };

            const response = await api.get('/patients', { params });
            // API returns ApiResponse<PaginatedResponse<PatientDto>>
            // api utility already extracts the 'data' part if it follows the usual pattern
            // but let's check what 'response' contains based on previous tools
            // Wait, usually api.js is configured to return result.data if success is true

            setPatients(response.data);
            setPagination({
                totalElements: response.totalElements,
                totalPages: response.totalPages,
                page: response.page,
                size: response.size
            });
        } catch (error) {
            console.error('Failed to fetch patients:', error);
        } finally {
            setLoading(false);
        }
    }, [page, size, sortBy, sortDir, search, gender, minAge, maxAge, doctorId, isActive, createdFrom, createdTo]);

    const fetchDoctors = async () => {
        try {
            const response = await api.get('/patients/doctors');
            setDoctors(response || []);
        } catch (error) {
            console.error('Failed to fetch doctors:', error);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    useEffect(() => {
        fetchDoctors();
    }, []);

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

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <DoctorSidebar />

            <main className="flex-1 p-8 min-w-0">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                        <div>
                            <button
                                onClick={() => navigate('/doctor/dashboard')}
                                className="flex items-center gap-2 text-gray-400 font-bold hover:text-primary mb-2 transition-colors uppercase text-[10px] tracking-widest"
                            >
                                <ArrowLeft className="w-3 h-3" /> Back to Dashboard
                            </button>
                            <h1 className="text-3xl font-black text-gray-900 leading-tight">Patient Registry</h1>
                            <p className="text-gray-500 font-medium">Archive of all clinical records and patient profiles</p>
                        </div>
                        <button
                            onClick={() => navigate('/doctor/patients/add')}
                            className="btn btn-primary shadow-xl shadow-primary/20 px-8 py-3.5 flex items-center gap-2"
                        >
                            <UserPlus className="w-5 h-5" /> Onboard New Patient
                        </button>
                    </div>

                    {/* Search and Quick Filters */}
                    <div className="space-y-4 mb-8">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 flex items-center bg-white shadow-sm rounded-2xl px-5 border border-transparent focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 transition-all h-14">
                                <Search className="text-gray-400 w-5 h-5 flex-shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Search by name, patient ID, email or mobile..."
                                    className="w-full bg-transparent border-none py-3 px-4 focus:outline-none font-bold text-gray-900 placeholder:text-gray-400"
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
                                        className="p-1 hover:bg-gray-100 rounded-full mr-2"
                                    >
                                        <X className="w-4 h-4 text-gray-400" />
                                    </button>
                                )}
                                <button
                                    onClick={handleSearchSubmit}
                                    className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                                >
                                    Search
                                </button>
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`btn h-14 px-6 flex items-center gap-2 transition-all ${showFilters ? 'btn-primary' : 'bg-white border-none shadow-sm text-gray-600 hover:bg-gray-50'}`}
                            >
                                <SlidersHorizontal className="w-5 h-5" />
                                <span className="font-bold">Advanced Filters</span>
                                {(gender || doctorId || isActive || minAge || maxAge) && (
                                    <span className="w-5 h-5 bg-primary text-white text-[10px] flex items-center justify-center rounded-full ml-1">
                                        !
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Collapsible Advanced Filters */}
                        {showFilters && (
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Gender Identity</label>
                                    <select
                                        className="input h-11 text-sm bg-gray-50"
                                        value={gender}
                                        onChange={(e) => updateParams({ gender: e.target.value })}
                                    >
                                        <option value="">All Genders</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Age Range</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            className="input h-11 text-sm bg-gray-50 px-3 w-1/2"
                                            value={minAge}
                                            onChange={(e) => updateParams({ minAge: e.target.value })}
                                        />
                                        <span className="text-gray-300">-</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            className="input h-11 text-sm bg-gray-50 px-3 w-1/2"
                                            value={maxAge}
                                            onChange={(e) => updateParams({ maxAge: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Onboarded By</label>
                                    <select
                                        className="input h-11 text-sm bg-gray-50"
                                        value={doctorId}
                                        onChange={(e) => updateParams({ doctorId: e.target.value })}
                                    >
                                        <option value="">All Doctors</option>
                                        {doctors.map(d => (
                                            <option key={d.doctorId} value={d.doctorId}>{d.fullName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Account Status</label>
                                    <select
                                        className="input h-11 text-sm bg-gray-50"
                                        value={isActive}
                                        onChange={(e) => updateParams({ isActive: e.target.value })}
                                    >
                                        <option value="">All Status</option>
                                        <option value="true">Active Only</option>
                                        <option value="false">Blocked / Inactive</option>
                                    </select>
                                </div>
                                <div className="space-y-2 lg:col-span-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Onboarding Date Range</label>
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex-1">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="date"
                                                className="input h-11 pl-10 text-sm bg-gray-50 w-full"
                                                value={createdFrom}
                                                onChange={(e) => updateParams({ createdFrom: e.target.value })}
                                            />
                                        </div>
                                        <span className="text-gray-300">to</span>
                                        <div className="relative flex-1">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="date"
                                                className="input h-11 pl-10 text-sm bg-gray-50 w-full"
                                                value={createdTo}
                                                onChange={(e) => updateParams({ createdTo: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-end lg:col-span-2">
                                    <button
                                        onClick={() => setSearchParams(new URLSearchParams())}
                                        className="text-xs font-black text-red-500 hover:text-red-600 px-4 py-3 flex items-center gap-2 uppercase tracking-tighter"
                                    >
                                        <X className="w-3 h-3" /> Reset all filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Patients Table */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white border-b border-gray-100">
                                        <th className="px-8 py-4">
                                            <button
                                                onClick={() => handleSort('fullName')}
                                                className={`group flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 ${sortBy === 'fullName' ? 'bg-primary/5 ring-1 ring-primary/10' : 'hover:bg-gray-50'}`}
                                            >
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${sortBy === 'fullName' ? 'text-primary' : 'text-gray-400'}`}>Patient Details</span>
                                                <SortIcon field="fullName" />
                                            </button>
                                        </th>
                                        <th className="px-6 py-4">
                                            <button
                                                onClick={() => handleSort('patientId')}
                                                className={`group flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 mx-auto ${sortBy === 'patientId' ? 'bg-primary/5 ring-1 ring-primary/10' : 'hover:bg-gray-50'}`}
                                            >
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${sortBy === 'patientId' ? 'text-primary' : 'text-gray-400'}`}>ID</span>
                                                <SortIcon field="patientId" />
                                            </button>
                                        </th>
                                        <th className="px-6 py-4">
                                            <button
                                                onClick={() => handleSort('age')}
                                                className={`group flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 ${sortBy === 'age' ? 'bg-primary/5 ring-1 ring-primary/10' : 'hover:bg-gray-50'}`}
                                            >
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${sortBy === 'age' ? 'text-primary' : 'text-gray-400'}`}>Age/Gender</span>
                                                <SortIcon field="age" />
                                            </button>
                                        </th>
                                        <th className="px-6 py-4">
                                            <button
                                                onClick={() => handleSort('createdAt')}
                                                className={`group flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 ${sortBy === 'createdAt' ? 'bg-primary/5 ring-1 ring-primary/10' : 'hover:bg-gray-50'}`}
                                            >
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${sortBy === 'createdAt' ? 'text-primary' : 'text-gray-400'}`}>Created at</span>
                                                <SortIcon field="createdAt" />
                                            </button>
                                        </th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest pl-6">Status</th>
                                        <th className="px-8 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" className="p-32 text-center">
                                                <div className="spinner mx-auto mb-4"></div>
                                                <p className="text-gray-400 font-bold">Retrieving patient records...</p>
                                            </td>
                                        </tr>
                                    ) : patients.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="p-32 text-center">
                                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                                    <Users className="w-10 h-10" />
                                                </div>
                                                <h3 className="text-xl font-black text-gray-900 mb-2">No matching records</h3>
                                                <p className="text-gray-400 font-medium">Try adjusting your filters or search term</p>
                                                <button
                                                    onClick={() => setSearchParams(new URLSearchParams())}
                                                    className="mt-6 text-primary font-black text-xs uppercase hover:underline"
                                                >
                                                    Clear all results
                                                </button>
                                            </td>
                                        </tr>
                                    ) : (
                                        patients.map((p) => (
                                            <tr key={p.id} className="hover:bg-gray-50/50 transition-all group border-b border-gray-50 last:border-0 relative">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-12 h-12 bg-primary-subtle text-primary rounded-2xl flex items-center justify-center font-black text-xl shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                                                            {p.fullName?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-gray-900 text-base leading-tight mb-1">{p.fullName}</p>
                                                            <div className="flex items-center gap-3">
                                                                <span className="flex items-center gap-1.5 text-gray-400 font-bold text-[11px] bg-gray-100/50 px-2 py-0.5 rounded-md">
                                                                    <Phone className="w-3 h-3" /> {p.mobileNumber}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 font-black text-primary text-xs text-center">
                                                    <span className="bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">{p.patientId}</span>
                                                </td>
                                                <td className="px-6 py-6 font-bold text-gray-600">
                                                    <div className="flex flex-col">
                                                        <span>{p.age} Years</span>
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{p.gender}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex flex-col">
                                                        <span className="font-black text-gray-700 text-xs">{p.createdAt ? format(new Date(p.createdAt), 'MMM dd, yyyy') : 'N/A'}</span>
                                                        <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 mt-1">
                                                            <User className="w-3 h-3" /> By {p.onboardedByDoctorName}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    {p.isActive ? (
                                                        <span className="flex items-center gap-1.5 text-green-500 font-black text-[10px] uppercase tracking-widest bg-green-50 px-2.5 py-1 rounded-full">
                                                            <CheckCircle2 className="w-3 h-3" /> Active
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5 text-gray-400 font-black text-[10px] uppercase tracking-widest bg-gray-100 px-2.5 py-1 rounded-full">
                                                            <AlertCircle className="w-3 h-3" /> Blocked
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                        <button
                                                            onClick={() => navigate(`/doctor/consultation/${p.patientId}`)}
                                                            className="btn btn-primary py-2.5 px-6 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                                                        >
                                                            Start Visit
                                                        </button>
                                                        <button
                                                            onClick={() => navigate(`/doctor/patients/${p.patientId}`)}
                                                            className="p-2.5 bg-white text-gray-400 hover:text-primary rounded-xl shadow-sm border border-gray-100 hover:border-primary/20 transition-all"
                                                            title="View Profile"
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

                    {/* Footer Controls */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Rows per page:</span>
                                <select
                                    className="bg-transparent text-sm font-black text-gray-700 focus:outline-none cursor-pointer hover:text-primary transition-colors"
                                    value={size}
                                    onChange={(e) => updateParams({ size: e.target.value, page: 1 })}
                                >
                                    {[10, 25, 50, 100].map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="h-4 w-px bg-gray-200"></div>
                            <p className="text-xs font-bold text-gray-500">
                                Showing <span className="text-gray-900 font-black">{Math.min((page - 1) * size + 1, pagination.totalElements)}</span> to{' '}
                                <span className="text-gray-900 font-black">{Math.min(page * size, pagination.totalElements)}</span> of{' '}
                                <span className="text-gray-900 font-black">{pagination.totalElements}</span> patients
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => updateParams({ page: page - 1 })}
                                disabled={page === 1}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm border border-gray-100 text-gray-500 hover:text-primary disabled:opacity-30 disabled:hover:text-gray-500 transition-all"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            {/* Page Multi-selection Logic (Simple version for now) */}
                            <div className="flex items-center gap-1.5">
                                {[...Array(pagination.totalPages)].map((_, i) => {
                                    const pNum = i + 1;
                                    // Show first, last, current, and one around current
                                    if (pNum === 1 || pNum === pagination.totalPages || Math.abs(pNum - page) <= 1) {
                                        return (
                                            <button
                                                key={pNum}
                                                onClick={() => updateParams({ page: pNum })}
                                                className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-xs transition-all ${page === pNum
                                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110'
                                                    : 'bg-white text-gray-500 hover:text-primary border border-gray-100 shadow-sm'
                                                    }`}
                                            >
                                                {pNum}
                                            </button>
                                        );
                                    } else if (Math.abs(pNum - page) === 2) {
                                        return <span key={pNum} className="text-gray-300">...</span>;
                                    }
                                    return null;
                                })}
                            </div>

                            <button
                                onClick={() => updateParams({ page: page + 1 })}
                                disabled={page === pagination.totalPages || pagination.totalPages === 0}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm border border-gray-100 text-gray-500 hover:text-primary disabled:opacity-30 disabled:hover:text-gray-500 transition-all"
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

export default PatientRegistry;
