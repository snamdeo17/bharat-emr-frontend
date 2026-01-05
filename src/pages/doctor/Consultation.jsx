import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Activity, ArrowLeft, User, History, FileText,
    Calendar, CheckCircle, Plus, Trash2, ShieldCheck,
    Stethoscope, Pill, ClipboardList, Send, ChevronRight, ChevronLeft
} from 'lucide-react';
import api from '../../config/api';

const Consultation = () => {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [step, setStep] = useState(1);

    // Form State
    const [history, setHistory] = useState({
        chiefComplaint: '',
        presentIllness: '',
        pastIllness: '',
        medicalHistory: '',
        surgicalHistory: '',
        clinicalNotes: ''
    });

    const [medicines, setMedicines] = useState([]);
    const [tests, setTests] = useState([]);
    const [followUp, setFollowUp] = useState({
        scheduledDate: '',
        notes: ''
    });

    useEffect(() => {
        fetchPatientDetails();
    }, [patientId]);

    const fetchPatientDetails = async () => {
        try {
            // We need an endpoint to get patient by ID or use the list we have
            // For now, let's assume we can fetch it
            const res = await api.get(`/doctor/patients`);
            const found = res.find(p => p.id === parseInt(patientId));
            if (found) {
                setPatient(found);
            } else {
                // Try fetching directly if endpoint exists
                try {
                    const pRes = await api.get(`/api/patients/${patientId}`);
                    setPatient(pRes);
                } catch (e) { }
            }
        } catch (error) {
            console.error('Failed to fetch patient:', error);
        } finally {
            setLoading(false);
        }
    };

    const addMedicine = () => {
        setMedicines([...medicines, { medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
    };

    const removeMedicine = (index) => {
        setMedicines(medicines.filter((_, i) => i !== index));
    };

    const updateMedicine = (index, field, value) => {
        const updated = [...medicines];
        updated[index][field] = value;
        setMedicines(updated);
    };

    const addTest = () => {
        setTests([...tests, { testName: '', instructions: '' }]);
    };

    const removeTest = (index) => {
        setTests(tests.filter((_, i) => i !== index));
    };

    const updateTest = (index, field, value) => {
        const updated = [...tests];
        updated[index][field] = value;
        setTests(updated);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const payload = {
                patientId: parseInt(patientId),
                ...history,
                medicines: medicines.filter(m => m.medicineName),
                tests: tests.filter(t => t.testName),
                followUp: followUp.scheduledDate ? followUp : null
            };

            await api.post('/visits', payload);
            alert('Consultation submitted successfully!');
            navigate('/doctor/dashboard');
        } catch (error) {
            console.error('Failed to submit consultation:', error);
            alert('Error submitting consultation. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="spinner"></div>
        </div>
    );

    const steps = [
        { id: 1, label: 'History', icon: <History /> },
        { id: 2, label: 'Prescription', icon: <Pill /> },
        { id: 3, label: 'Follow-up', icon: <Calendar /> },
        { id: 4, label: 'Review', icon: <CheckCircle /> }
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/doctor/dashboard')}
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 hover:bg-primary-subtle hover:text-primary transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h2 className="text-lg font-extrabold text-gray-900 leading-tight">Patient Consultation</h2>
                            <p className="text-xs font-bold text-primary uppercase tracking-widest">
                                {patient?.fullName} • {patient?.age}Y • {patient?.gender}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-primary font-bold bg-primary-subtle px-4 py-2 rounded-full text-sm">
                        <ShieldCheck className="w-4 h-4" />
                        Live Session
                    </div>
                </div>

                {/* Step Progress */}
                <div className="bg-white border-b border-gray-50">
                    <div className="max-w-4xl mx-auto px-6 py-4">
                        <div className="flex justify-between relative">
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0" />
                            {steps.map((s) => (
                                <div key={s.id} className="relative z-10 flex flex-col items-center gap-2 group">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${step >= s.id ? 'bg-primary text-white shadow-lg' : 'bg-white border-2 border-gray-100 text-gray-300'
                                            }`}
                                    >
                                        {React.cloneElement(s.icon, { className: 'w-5 h-5' })}
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${step >= s.id ? 'text-primary' : 'text-gray-300'
                                        }`}>{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto mt-10 px-6">
                {/* Step 1: History Taking */}
                {step === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-top-4">
                        <div className="mb-6">
                            <h3 className="text-2xl font-black text-gray-900">Clinical History</h3>
                            <p className="text-gray-500 font-medium">Record patient's symptoms and past medical conditions.</p>
                        </div>

                        <div className="bg-white rounded-[32px] p-8 md-p-10 shadow-premium border border-gray-50 space-y-8">
                            <div className="space-y-2">
                                <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Chief Complaint *</label>
                                <textarea
                                    className="input min-h-[100px] pt-4"
                                    placeholder="Enter patient's primary symptoms..."
                                    value={history.chiefComplaint}
                                    onChange={(e) => setHistory({ ...history, chiefComplaint: e.target.value })}
                                />
                            </div>

                            <div className="grid md-grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">History of Present Illness</label>
                                    <textarea
                                        className="input min-h-[120px] pt-4"
                                        placeholder="Detailed progression of current issue..."
                                        value={history.presentIllness}
                                        onChange={(e) => setHistory({ ...history, presentIllness: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Past Illnesses</label>
                                    <textarea
                                        className="input min-h-[120px] pt-4"
                                        placeholder="Previous hospitalizations or chronic conditions..."
                                        value={history.pastIllness}
                                        onChange={(e) => setHistory({ ...history, pastIllness: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid md-grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Medical History</label>
                                    <textarea
                                        className="input min-h-[120px] pt-4"
                                        placeholder="Family history, allergies, etc..."
                                        value={history.medicalHistory}
                                        onChange={(e) => setHistory({ ...history, medicalHistory: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Surgical History</label>
                                    <textarea
                                        className="input min-h-[120px] pt-4"
                                        placeholder="Previous surgeries and procedures..."
                                        value={history.surgicalHistory}
                                        onChange={(e) => setHistory({ ...history, surgicalHistory: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Prescription Writing */}
                {step === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-top-4">
                        <div className="mb-6 flex justify-between items-end">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900">Digital Prescription</h3>
                                <p className="text-gray-500 font-medium">Add medicines and diagnostic tests.</p>
                            </div>
                            <button
                                onClick={addMedicine}
                                className="btn btn-primary py-2 px-6 rounded-xl flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Add Medicine
                            </button>
                        </div>

                        <div className="space-y-6">
                            {medicines.map((med, idx) => (
                                <div key={idx} className="bg-white rounded-3xl p-6 shadow-premium border border-gray-50 relative group">
                                    <button
                                        onClick={() => removeMedicine(idx)}
                                        className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                    <div className="grid md-grid-cols-12 gap-6 items-end pr-8">
                                        <div className="md-col-span-4 space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Medicine Name</label>
                                            <input
                                                className="input"
                                                placeholder="e.g. Paracetamol 500mg"
                                                value={med.medicineName}
                                                onChange={(e) => updateMedicine(idx, 'medicineName', e.target.value)}
                                            />
                                        </div>
                                        <div className="md-col-span-2 space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Dosage</label>
                                            <input
                                                className="input"
                                                placeholder="1 tab"
                                                value={med.dosage}
                                                onChange={(e) => updateMedicine(idx, 'dosage', e.target.value)}
                                            />
                                        </div>
                                        <div className="md-col-span-3 space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Frequency</label>
                                            <select
                                                className="input text-sm"
                                                value={med.frequency}
                                                onChange={(e) => updateMedicine(idx, 'frequency', e.target.value)}
                                            >
                                                <option value="">Select</option>
                                                <option value="1-0-1">1-0-1 (Twice daily)</option>
                                                <option value="1-1-1">1-1-1 (Thrice daily)</option>
                                                <option value="1-0-0">1-0-0 (Morning)</option>
                                                <option value="0-0-1">0-0-1 (Night)</option>
                                                <option value="SOS">SOS (If needed)</option>
                                            </select>
                                        </div>
                                        <div className="md-col-span-3 space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Duration</label>
                                            <input
                                                className="input text-sm"
                                                placeholder="5 days"
                                                value={med.duration}
                                                onChange={(e) => updateMedicine(idx, 'duration', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4 space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Instructions</label>
                                        <input
                                            className="input text-sm bg-gray-50 border-transparent focus:bg-white"
                                            placeholder="Before food, warm water, etc..."
                                            value={med.instructions}
                                            onChange={(e) => updateMedicine(idx, 'instructions', e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}

                            {medicines.length === 0 && (
                                <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-100">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Pill className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p className="font-bold text-gray-400">No medicines added yet.</p>
                                    <button onClick={addMedicine} className="text-primary font-black hover:underline mt-2">Add your first medicine</button>
                                </div>
                            )}
                        </div>

                        {/* Lab Tests Section */}
                        <div className="mt-12">
                            <div className="flex justify-between items-end mb-6">
                                <h3 className="text-xl font-black text-gray-900 border-l-4 border-secondary pl-4">Diagnostic Tests</h3>
                                <button
                                    onClick={addTest}
                                    className="text-secondary font-black hover:underline flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" /> Add Test
                                </button>
                            </div>

                            <div className="grid md-grid-cols-2 gap-6">
                                {tests.map((test, idx) => (
                                    <div key={idx} className="bg-white rounded-2xl p-6 shadow-premium border border-gray-50 flex gap-4">
                                        <div className="flex-1 space-y-4">
                                            <input
                                                className="input font-bold"
                                                placeholder="Test Name (e.g. CBC)"
                                                value={test.testName}
                                                onChange={(e) => updateTest(idx, 'testName', e.target.value)}
                                            />
                                            <input
                                                className="input text-sm placeholder:text-gray-300 bg-gray-50 border-transparent focus:bg-white"
                                                placeholder="Diagnostic instructions..."
                                                value={test.instructions}
                                                onChange={(e) => updateTest(idx, 'instructions', e.target.value)}
                                            />
                                        </div>
                                        <button onClick={() => removeTest(idx)} className="text-gray-200 hover:text-red-500 pt-2"><Trash2 className="w-5 h-5" /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Follow-up & Scheduling */}
                {step === 3 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-top-4">
                        <div className="mb-6">
                            <h3 className="text-2xl font-black text-gray-900">Next Appointment</h3>
                            <p className="text-gray-500 font-medium">Schedule a follow-up visit for the patient.</p>
                        </div>

                        <div className="bg-white rounded-[32px] p-8 md-p-12 shadow-premium border border-gray-50 max-w-2xl mx-auto text-center">
                            <div className="w-20 h-20 bg-primary-subtle rounded-3xl flex items-center justify-center text-primary mx-auto mb-8">
                                <Calendar className="w-10 h-10" />
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest block">Select Follow-up Date</label>
                                    <input
                                        type="date"
                                        className="input text-center max-w-sm mx-auto text-lg font-bold"
                                        value={followUp.scheduledDate}
                                        onChange={(e) => setFollowUp({ ...followUp, scheduledDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-4 text-left">
                                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Follow-up Advice/Notes</label>
                                    <textarea
                                        className="input min-h-[120px] pt-4"
                                        placeholder="Any specific instructions for next visit..."
                                        value={followUp.notes}
                                        onChange={(e) => setFollowUp({ ...followUp, notes: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Review & Submit */}
                {step === 4 && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-top-4">
                        <div className="text-center mb-10">
                            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4 text-success">
                                <ShieldCheck className="w-10 h-10" />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 leading-tight">Review EMR Entry</h3>
                            <p className="text-gray-500 font-medium">Please verify the details before final submission.</p>
                        </div>

                        <div className="grid md-grid-cols-2 gap-8">
                            {/* Summary Cards */}
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <History className="w-5 h-5 text-primary" />
                                    <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs">Clinical Summary</h4>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Chief Complaint</p>
                                        <p className="text-sm font-bold text-gray-700">{history.chiefComplaint || 'No recording'}</p>
                                    </div>
                                    {history.presentIllness && (
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Notes</p>
                                            <p className="text-sm text-gray-500 line-clamp-3">{history.presentIllness}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <Pill className="w-5 h-5 text-accent" />
                                    <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs">Prescription</h4>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-sm font-bold text-gray-700">{medicines.length} Medicines added</p>
                                    <div className="flex flex-wrap gap-2">
                                        {medicines.map((m, i) => (
                                            <span key={i} className="badge badge-primary">{m.medicineName}</span>
                                        ))}
                                    </div>
                                    <p className="text-sm font-bold text-gray-700">{tests.length} Lab tests recommended</p>
                                </div>
                            </div>
                        </div>

                        {/* Submission Banner */}
                        <div className="bg-primary text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
                            <div className="relative z-10 flex flex-col md-flex items-center justify-between gap-6">
                                <div className="text-center md-text-left">
                                    <h4 className="text-xl font-black mb-1">Ready to Save?</h4>
                                    <p className="text-blue-100 text-sm font-medium">Patient will receive visit summary via SMS & WhatsApp.</p>
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="btn bg-white text-primary px-10 py-4 text-lg font-black min-w-[200px]"
                                >
                                    {submitting ? 'Submitting...' : 'Save & Submit'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Navigation */}
                <div className="mt-12 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <button
                        onClick={() => setStep(Math.max(1, step - 1))}
                        disabled={step === 1}
                        className={`btn btn-ghost py-3 px-8 font-extrabold flex items-center gap-2 ${step === 1 ? 'opacity-30' : ''}`}
                    >
                        <ChevronLeft className="w-5 h-5" /> Previous
                    </button>

                    <div className="flex gap-2">
                        {steps.map(s => (
                            <div key={s.id} className={`w-2 h-2 rounded-full ${step === s.id ? 'bg-primary w-6' : 'bg-gray-100'} transition-all`} />
                        ))}
                    </div>

                    {step < 4 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            className="btn btn-primary py-3 px-10 font-black flex items-center gap-2"
                        >
                            Next Step <ChevronRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <div className="w-[140px]" /> /* Spacer */
                    )}
                </div>
            </main>
        </div>
    );
};

export default Consultation;
