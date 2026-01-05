import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, User, Calendar, Phone, Mail,
    MapPin, History, FileText, Download, Eye,
    Plus, Clock, Heart, Shield
} from 'lucide-react';
import api from '../../config/api';
import { format } from 'date-fns';

import DoctorSidebar from '../../components/DoctorSidebar';

const PatientDetails = () => {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all patients and find this one (fallback if direct API not ready)
                const patients = await api.get('/doctor/patients');
                const found = patients.find(p => p.patientId === patientId);
                if (found) {
                    setPatient(found);
                    // Fetch visits for this patient
                    const visitsData = await api.get(`/api/visits/patient/${found.patientId}`);
                    setVisits(visitsData);
                }
            } catch (error) {
                console.error('Failed to fetch patient records:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [patientId]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="spinner"></div></div>;
    if (!patient) return <div className="min-h-screen flex items-center justify-center">Patient not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <DoctorSidebar />

            <main className="flex-1 p-8 overflow-y-auto h-screen">
                {/* Header */}
                <header className="bg-white border-b border-gray-100 rounded-2xl p-6 mb-8 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/doctor/patients')}
                            className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-primary-subtle hover:text-primary transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-xl font-black text-gray-900">Patient Profile</h1>
                            <p className="text-xs font-bold text-gray-400">Monitoring medical records for #{patient.patientId}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate(`/doctor/consultation/${patient.patientId}`)}
                        className="btn btn-primary px-6 py-2.5 shadow-lg flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> New Consultation
                    </button>
                </header>

                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Sidebar: Patient Info */}
                        <div className="space-y-8">
                            <div className="card text-center p-8 bg-white border-none shadow-sm">
                                <div className="w-24 h-24 bg-primary-subtle rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary border-4 border-white shadow-xl font-black text-3xl">
                                    {patient.fullName?.charAt(0)}
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 mb-1">{patient.fullName}</h2>
                                <p className="text-primary font-bold text-sm uppercase tracking-widest mb-6">{patient.patientId}</p>

                                <div className="flex justify-center gap-4 border-t border-gray-50 pt-6">
                                    <div className="text-center px-4">
                                        <p className="text-xs font-black text-gray-400 uppercase">Age</p>
                                        <p className="font-bold text-gray-900">{patient.age}</p>
                                    </div>
                                    <div className="w-px h-8 bg-gray-100"></div>
                                    <div className="text-center px-4">
                                        <p className="text-xs font-black text-gray-400 uppercase">Gender</p>
                                        <p className="font-bold text-gray-900">{patient.gender}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="card p-6 bg-white border-none shadow-sm space-y-6">
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-4 text-center">Contact Details</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400"><Phone className="w-4 h-4" /></div>
                                        <p className="text-sm font-bold text-gray-700">{patient.mobileNumber}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400"><Mail className="w-4 h-4" /></div>
                                        <p className="text-sm font-bold text-gray-700">{patient.email || 'No email provided'}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400"><MapPin className="w-4 h-4" /></div>
                                        <p className="text-sm font-bold text-gray-700 leading-snug">{patient.address || 'Address not registered'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content: Medical History */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Section Header */}
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                    <History className="w-7 h-7 text-primary" /> Medical History
                                </h3>
                                <button className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                                    Download Summary <Download className="w-4 h-4" />
                                </button>
                            </div>

                            {visits.length === 0 ? (
                                <div className="card p-20 text-center bg-white border-none shadow-sm flex flex-col items-center border-2 border-dashed border-gray-100">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                        <FileText className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p className="text-gray-400 font-bold mb-4">No health records available for this patient.</p>
                                    <button
                                        onClick={() => navigate(`/doctor/consultation/${patient.patientId}`)}
                                        className="btn btn-outline"
                                    >
                                        Start First Consultation
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {visits.map((visit) => (
                                        <div key={visit.id} className="card p-8 bg-white border-none shadow-sm hover:shadow-xl transition-all group border-l-4 border-transparent hover:border-primary">
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="badge badge-primary py-1 px-3 text-[10px] font-black uppercase tracking-widest">
                                                            Visit ID: #{visit.id}
                                                        </span>
                                                        <div className="flex items-center text-xs font-bold text-gray-400 gap-1">
                                                            <Clock className="w-3 h-3" /> {format(new Date(visit.visitDate), 'MMM dd, yyyy • hh:mm a')}
                                                        </div>
                                                    </div>
                                                    <h4 className="text-xl font-extrabold text-gray-900 leading-tight">Chief Complaint: {visit.chiefComplaint}</h4>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary-subtle hover:text-primary transition-all shadow-sm">
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary-subtle hover:text-primary transition-all shadow-sm">
                                                        <Download className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-8 mt-6 pt-6 border-t border-gray-50">
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                        <Heart className="w-3 h-3 text-red-400" /> Prescription Summary
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {visit.medicines?.length > 0 ? (
                                                            visit.medicines.map((m, i) => (
                                                                <span key={i} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-bold border border-gray-100">
                                                                    {m.medicineName}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-xs text-gray-400 font-medium italic font-bold">No medicines prescribed</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                        <Shield className="w-3 h-3 text-blue-400" /> Diagnostic Tests
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {visit.tests?.length > 0 ? (
                                                            visit.tests.map((t, i) => (
                                                                <span key={i} className="px-3 py-1 bg-blue-50 text-primary rounded-full text-xs font-bold border border-blue-50">
                                                                    {t.testName}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-xs text-gray-400 font-medium italic font-bold">No tests record</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PatientDetails;
