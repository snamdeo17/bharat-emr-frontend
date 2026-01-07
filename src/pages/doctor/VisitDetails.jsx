import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Calendar, User, Activity,
    FileText, Pill, Shield, Clock, Download,
    ChevronRight, Heart, FlaskConical, MapPin, Phone
} from 'lucide-react';
import api from '../../config/api';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import DoctorSidebar from '../../components/DoctorSidebar';
import PatientSidebar from '../../components/PatientSidebar';

const VisitDetails = () => {
    const { visitId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [visit, setVisit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    const isDoctor = user?.userType === 'DOCTOR';

    useEffect(() => {
        const fetchVisitDetails = async () => {
            try {
                const data = await api.get(`/visits/${visitId}`);
                setVisit(data);
            } catch (error) {
                console.error('Failed to fetch visit details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchVisitDetails();
    }, [visitId]);

    const handleDownloadPdf = async () => {
        setDownloading(true);
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
            alert('Failed to download PDF');
        } finally {
            setDownloading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex">
            {isDoctor ? <DoctorSidebar /> : <PatientSidebar />}
            <div className="flex-1 flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        </div>
    );

    if (!visit) return (
        <div className="min-h-screen bg-gray-50 flex">
            {isDoctor ? <DoctorSidebar /> : <PatientSidebar />}
            <div className="flex-1 flex flex-col items-center justify-center">
                <p className="text-gray-500 font-bold mb-4">Visit case record not found.</p>
                <button onClick={() => navigate(-1)} className="btn btn-primary">Go Back</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {isDoctor ? <DoctorSidebar /> : <PatientSidebar />}

            <main className="flex-1 p-8 overflow-y-auto h-screen">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 hover:text-primary transition-all"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-black text-gray-900">Case Details</h1>
                                <p className="text-sm font-bold text-gray-400 flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> Consultation on {format(new Date(visit.visitDate), 'MMMM dd, yyyy')}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleDownloadPdf}
                            disabled={downloading}
                            className="btn btn-primary px-6 flex items-center gap-2 shadow-lg shadow-primary/20"
                        >
                            {downloading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <Download className="w-5 h-5" />
                            )}
                            Download Prescription
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left Column: Patient Profile Card */}
                        <div className="md:col-span-1 space-y-6">
                            <div className="card bg-white p-6 border-none shadow-sm space-y-6">
                                <div className="text-center">
                                    <h3 className="font-black text-gray-900 text-lg">{visit.patientName}</h3>
                                </div>
                                <div className="space-y-4 pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400"><User className="w-4 h-4" /></div>
                                        <p className="text-sm font-bold text-gray-700">Patient ID: {visit.patientId}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400"><Activity className="w-4 h-4" /></div>
                                        <p className="text-sm font-bold text-gray-700">Visit Type: Consultation</p>
                                    </div>
                                </div>
                                {isDoctor && (
                                    <button
                                        onClick={() => navigate(`/doctor/patients/${visit.patientId}`)}
                                        className="w-full py-3 bg-gray-50 text-gray-400 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-primary-subtle hover:text-primary transition-all"
                                    >
                                        View Full Patient Profile
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Case Information */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Chief Complaint & Notes */}
                            <div className="card bg-white p-8 border-none shadow-sm space-y-8">
                                <div>
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Activity className="w-3 h-3 text-primary" /> Clinical Assessment
                                    </h4>
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-xs font-black text-gray-900 mb-1">Chief Complaint</p>
                                            <p className="text-base text-gray-700 font-bold bg-gray-50 p-4 rounded-xl border border-gray-100 italic">"{visit.chiefComplaint}"</p>
                                        </div>
                                        {visit.clinicalNotes && (
                                            <div>
                                                <p className="text-xs font-black text-gray-900 mb-1">Clinical Notes</p>
                                                <p className="text-sm text-gray-600 font-medium leading-relaxed">{visit.clinicalNotes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Past & Present Illness */}
                                <div className="grid grid-cols-2 gap-6 pt-8 border-t border-gray-50">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Present Illness</p>
                                        <p className="text-sm font-bold text-gray-700">{visit.presentIllness || 'None recorded'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Past Illness</p>
                                        <p className="text-sm font-bold text-gray-700">{visit.pastIllness || 'None recorded'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Prescription & Medicines */}
                            <div className="card bg-white p-8 border-none shadow-sm">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Pill className="w-3 h-3 text-primary" /> Digital Prescription
                                </h4>
                                <div className="space-y-4">
                                    {visit.medicines && visit.medicines.length > 0 ? (
                                        visit.medicines.map((m, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                                                        <Heart className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900">{m.medicineName}</p>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase">{m.dosage} • {m.frequency}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="px-3 py-1 bg-primary text-white text-[10px] font-black rounded-lg uppercase">
                                                        {m.duration}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-400 font-bold italic py-4">No medications prescribed for this case.</p>
                                    )}
                                </div>
                            </div>

                            {/* Recommended Tests */}
                            {visit.tests && visit.tests.length > 0 && (
                                <div className="card bg-white p-8 border-none shadow-sm">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <FlaskConical className="w-3 h-3 text-primary" /> Diagnostic Tests
                                    </h4>
                                    <div className="flex flex-wrap gap-3">
                                        {visit.tests.map((t, i) => (
                                            <div key={i} className="px-5 py-3 bg-blue-50 text-primary border border-blue-100 rounded-2xl font-black text-xs flex items-center gap-2">
                                                <Shield className="w-4 h-4" /> {t.testName}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Follow up */}
                            {visit.followUp && (
                                <div className="card bg-primary p-8 border-none shadow-lg shadow-primary/20 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Recommended Follow-up</h4>
                                            <p className="text-xl font-black">{format(new Date(visit.followUp.scheduledDate), 'MMMM dd, yyyy')}</p>
                                            {visit.followUp.notes && (
                                                <p className="mt-4 text-sm font-medium text-white/80 italic bg-white/10 p-4 rounded-xl">
                                                    "{visit.followUp.notes}"
                                                </p>
                                            )}
                                        </div>
                                        <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center">
                                            <Calendar className="w-8 h-8" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default VisitDetails;
