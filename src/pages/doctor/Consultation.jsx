import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, History, Pill, Calendar,
    ClipboardCheck, Plus, Trash2, CheckCircle2,
    Activity, User, ChevronRight, Save, Shield
} from 'lucide-react';
import api from '../../config/api';
import { format } from 'date-fns';
import DoctorSidebar from '../../components/DoctorSidebar';

const Consultation = () => {
    const { patientId, visitId } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!visitId;
    const [patient, setPatient] = useState(null);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);

    // Form states
    const [history, setHistory] = useState({
        chiefComplaint: '',
        presentIllness: '',
        pastIllness: '',
        medicalHistory: '',
        surgicalHistory: '',
        clinicalNotes: ''
    });

    const [medicines, setMedicines] = useState([
        { medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' }
    ]);

    const [tests, setTests] = useState([
        { testName: '', instructions: '' }
    ]);

    const [followUp, setFollowUp] = useState({
        scheduledDate: '',
        notes: ''
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                if (isEditMode) {
                    const visitData = await api.get(`/visits/${visitId}`);
                    setHistory({
                        chiefComplaint: visitData.chiefComplaint || '',
                        presentIllness: visitData.presentIllness || '',
                        pastIllness: visitData.pastIllness || '',
                        medicalHistory: visitData.medicalHistory || '',
                        surgicalHistory: visitData.surgicalHistory || '',
                        clinicalNotes: visitData.clinicalNotes || ''
                    });

                    if (visitData.medicines && visitData.medicines.length > 0) {
                        setMedicines(visitData.medicines);
                    }
                    if (visitData.tests && visitData.tests.length > 0) {
                        setTests(visitData.tests);
                    }
                    if (visitData.followUp) {
                        setFollowUp({
                            scheduledDate: visitData.followUp.scheduledDate ? visitData.followUp.scheduledDate.split('T')[0] : '',
                            notes: visitData.followUp.notes || ''
                        });
                    }

                    // For edit mode, we use patientId from visit record
                    const patients = await api.get('/doctor/patients');
                    const targetPatient = patients.find(p => p.id === visitData.patientId || p.patientId === visitData.patientId);
                    if (targetPatient) setPatient(targetPatient);
                } else {
                    const patients = await api.get('/doctor/patients');
                    const targetPatient = patients.find(p => p.patientId === patientId);
                    if (targetPatient) setPatient(targetPatient);
                }
            } catch (error) {
                console.error('Failed to fetch initial data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [patientId, visitId, isEditMode]);

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const addMedicine = () => setMedicines([...medicines, { medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
    const removeMedicine = (index) => setMedicines(medicines.filter((_, i) => i !== index));
    const updateMedicine = (index, field, value) => {
        const updated = [...medicines];
        updated[index][field] = value;
        setMedicines(updated);
    };

    const addTest = () => setTests([...tests, { testName: '', instructions: '' }]);
    const removeTest = (index) => setTests(tests.filter((_, i) => i !== index));
    const updateTest = (index, field, value) => {
        const updated = [...tests];
        updated[index][field] = value;
        setTests(updated);
    };

    const handleSubmit = async () => {
        try {
            const visitData = {
                patientId: patient.id || patient.patientId,
                ...history,
                medicines: medicines.filter(m => m.medicineName),
                tests: tests.filter(t => t.testName),
                followUp: followUp.scheduledDate ? followUp : null
            };

            if (isEditMode) {
                await api.put(`/visits/${visitId}`, visitData);
            } else {
                await api.post('/visits', visitData);
            }
            navigate('/doctor/history');
        } catch (error) {
            console.error('Failed to submit visit:', error);
            alert('Failed to save visit details. Please try again.');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="spinner"></div></div>;

    const steps = [
        { id: 1, label: 'History', icon: <History /> },
        { id: 2, label: 'Prescription', icon: <Pill /> },
        { id: 3, label: 'Follow-up', icon: <Calendar /> },
        { id: 4, label: 'Review', icon: <ClipboardCheck /> }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <DoctorSidebar />

            <main className="flex-1 p-8 overflow-y-auto h-screen min-w-0">
                <div className="max-w-4xl mx-auto">
                    {/* Consultation Header */}
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 hover:text-primary transition-all">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 leading-tight">
                                    {isEditMode ? 'Edit Case Record' : 'Consultation Session'}
                                </h1>
                                <p className="text-sm font-bold text-gray-400">
                                    {isEditMode ? `Updating clinical notes for ${patient?.fullName}` : `Recording medical encounter for ${patient?.fullName}`}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white p-2 pr-6 rounded-2xl shadow-sm">
                            <div className="w-10 h-10 bg-primary-subtle text-primary rounded-xl flex items-center justify-center font-black">
                                {patient?.fullName?.charAt(0)}
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-black text-gray-900">{patient?.fullName}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{patient?.patientId}</p>
                            </div>
                        </div>
                    </div>

                    {/* Stepper */}
                    <div className="flex justify-between items-center mb-12 relative px-4">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 -z-0"></div>
                        <div className="absolute top-1/2 left-0 h-0.5 bg-primary transition-all duration-500 -translate-y-1/2 -z-0" style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}></div>
                        {steps.map((s) => (
                            <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 font-bold ${step >= s.id ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-110' : 'bg-white text-gray-300'
                                    }`}>
                                    {step > s.id ? <CheckCircle2 className="w-6 h-6" /> : React.cloneElement(s.icon, { className: 'w-5 h-5' })}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${step >= s.id ? 'text-primary' : 'text-gray-300'}`}>
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Step Content */}
                    <div className="card p-10 mb-8 border-none shadow-sm bg-white min-h-[400px]">
                        {step === 1 && (
                            <div className="space-y-8 animate-fade-in">
                                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                                    <History className="w-6 h-6 text-primary" /> Patient Medical History
                                </h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Chief Complaint</label>
                                        <textarea
                                            className="input py-4 min-h-[80px]"
                                            placeholder="Reason for visit..."
                                            value={history.chiefComplaint}
                                            onChange={(e) => setHistory({ ...history, chiefComplaint: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid md-grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Present Illness</label>
                                            <textarea
                                                className="input py-4 min-h-[120px]"
                                                value={history.presentIllness}
                                                onChange={(e) => setHistory({ ...history, presentIllness: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Clinical Notes</label>
                                            <textarea
                                                className="input py-4 min-h-[120px]"
                                                value={history.clinicalNotes}
                                                onChange={(e) => setHistory({ ...history, clinicalNotes: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                        <Pill className="w-6 h-6 text-primary" /> Digital Prescription
                                    </h3>
                                    <button onClick={addMedicine} className="btn btn-primary py-2 text-xs">
                                        <Plus className="w-4 h-4" /> Add Medicine
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {medicines.map((m, i) => (
                                        <div key={i} className="p-6 bg-gray-50 rounded-2xl relative group border border-transparent hover:border-primary-20 transition-all">
                                            <button onClick={() => removeMedicine(i)} className="absolute -top-2 -right-2 w-8 h-8 bg-white text-red-500 rounded-lg shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <div className="grid md-grid-cols-2 lg-grid-cols-4 gap-4">
                                                <div className="lg-col-span-1">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Medicine Name</label>
                                                    <input className="input h-10 text-sm" value={m.medicineName} onChange={(e) => updateMedicine(i, 'medicineName', e.target.value)} />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Dosage</label>
                                                    <input className="input h-10 text-sm" value={m.dosage} placeholder="e.g. 500mg" onChange={(e) => updateMedicine(i, 'dosage', e.target.value)} />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Frequency</label>
                                                    <select className="input h-10 text-sm" value={m.frequency} onChange={(e) => updateMedicine(i, 'frequency', e.target.value)}>
                                                        <option value="">Select...</option>
                                                        <option value="1-0-1">1-0-1 (Morning & Night)</option>
                                                        <option value="1-1-1">1-1-1 (Thrice a day)</option>
                                                        <option value="0-0-1">0-0-1 (Night only)</option>
                                                        <option value="1-0-0">1-0-0 (Morning only)</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Duration</label>
                                                    <input className="input h-10 text-sm" value={m.duration} placeholder="e.g. 5 Days" onChange={(e) => updateMedicine(i, 'duration', e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Diagnostic Tests Section */}
                                <div className="mt-12 pt-12 border-t border-gray-100">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                            <Shield className="w-6 h-6 text-primary" /> Diagnostic Tests
                                        </h3>
                                        <button onClick={addTest} className="btn btn-primary py-2 text-xs">
                                            <Plus className="w-4 h-4" /> Add Test
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {tests.map((t, i) => (
                                            <div key={i} className="p-6 bg-gray-50 rounded-2xl relative group border border-transparent hover:border-primary-20 transition-all">
                                                <button onClick={() => removeTest(i)} className="absolute -top-2 -right-2 w-8 h-8 bg-white text-red-500 rounded-lg shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <div className="grid md-grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Test Name</label>
                                                        <input
                                                            className="input h-10 text-sm"
                                                            value={t.testName}
                                                            placeholder="e.g. Blood Count"
                                                            onChange={(e) => updateTest(i, 'testName', e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Special Instructions</label>
                                                        <input
                                                            className="input h-10 text-sm"
                                                            value={t.instructions}
                                                            placeholder="e.g. Fasting required"
                                                            onChange={(e) => updateTest(i, 'instructions', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-8 animate-fade-in">
                                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                                    <Calendar className="w-6 h-6 text-primary" /> Follow-up Schedule
                                </h3>
                                <div className="grid md-grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Follow-up Date</label>
                                        <input
                                            type="date"
                                            className="input h-12"
                                            value={followUp.scheduledDate}
                                            onChange={(e) => setFollowUp({ ...followUp, scheduledDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Special Instructions</label>
                                        <textarea
                                            className="input py-4 min-h-[100px]"
                                            placeholder="Notes for follow-up..."
                                            value={followUp.notes}
                                            onChange={(e) => setFollowUp({ ...followUp, notes: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-10 animate-fade-in py-6">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ClipboardCheck className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900">Review Record</h3>
                                    <p className="text-gray-500 font-medium">Please verify the details before final submission</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 text-left">
                                    {/* History Summary */}
                                    <div className="space-y-6">
                                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                                                <History className="w-3 h-3" /> Clinical History
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Chief Complaint</p>
                                                    <p className="text-sm font-bold text-gray-700 leading-relaxed">{history.chiefComplaint || 'No complaint recorded'}</p>
                                                </div>
                                                {history.presentIllness && (
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Present Illness</p>
                                                        <p className="text-sm font-bold text-gray-700 leading-relaxed truncate">{history.presentIllness}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                                                <Calendar className="w-3 h-3" /> Follow-up Details
                                            </div>
                                            {followUp.scheduledDate ? (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <p className="text-xs font-black text-primary bg-primary-subtle px-3 py-1 rounded-md">
                                                            Scheduled: {format(new Date(followUp.scheduledDate), 'MMM dd, yyyy')}
                                                        </p>
                                                    </div>
                                                    {followUp.notes && (
                                                        <p className="text-xs text-gray-500 font-medium bg-white p-3 rounded-lg border border-gray-50 italic">
                                                            "{followUp.notes}"
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-gray-400 font-bold">No follow-up scheduled</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Medical Plan Summary */}
                                    <div className="space-y-6">
                                        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
                                                <Pill className="w-3 h-3" /> Prescribed Medicines
                                            </div>
                                            <div className="space-y-5">
                                                {medicines.filter(m => m.medicineName).length > 0 ? (
                                                    medicines.filter(m => m.medicineName).map((m, idx) => (
                                                        <div key={idx} className="flex justify-between items-start border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                                                            <div>
                                                                <p className="font-black text-gray-800 text-sm">{m.medicineName}</p>
                                                                <p className="text-[10px] font-bold text-gray-400 uppercase">{m.dosage || 'Standard'} • {m.frequency}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="text-[10px] bg-gray-50 px-2 py-1 rounded text-gray-400 font-black">{m.duration}</span>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-xs text-gray-400 font-bold italic">No medications prescribed</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
                                                <Shield className="w-3 h-3" /> Diagnostic Tests
                                            </div>
                                            <div className="space-y-4">
                                                {tests.filter(t => t.testName).length > 0 ? (
                                                    tests.filter(t => t.testName).map((t, idx) => (
                                                        <div key={idx} className="flex flex-col gap-1 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                                                            <p className="font-black text-gray-800 text-sm flex items-center gap-2">
                                                                <div className="w-1.5 h-1.5 bg-primary rounded-full" /> {t.testName}
                                                            </p>
                                                            {t.instructions && <p className="text-[10px] text-gray-400 italic font-medium ml-3.5">{t.instructions}</p>}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-xs text-gray-400 font-bold italic">No diagnostic tests requested</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between">
                        {step > 1 ? (
                            <button onClick={handleBack} className="btn btn-outline px-10">
                                Back
                            </button>
                        ) : <div></div>}

                        {step < 4 ? (
                            <button onClick={handleNext} className="btn btn-primary px-10 shadow-xl shadow-primary/20 flex items-center gap-2">
                                Next Step <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button onClick={handleSubmit} className="btn btn-primary px-10 shadow-xl shadow-primary/20 flex items-center gap-2">
                                <Save className="w-4 h-4" /> {isEditMode ? 'Update & Save' : 'Finalize & Submit'}
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Consultation;
