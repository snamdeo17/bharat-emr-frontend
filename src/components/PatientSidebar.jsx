import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Activity, History, Calendar, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PatientSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const isActive = (path) => location.pathname === path;

    const handleHistoryClick = () => {
        navigate('/patient/history');
    };

    return (
        <aside className="w-20 bg-white border-r border-gray-100 flex flex-col items-center py-6 gap-8 h-screen sticky top-0 flex-shrink-0">
            <div
                className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl shadow-lg cursor-pointer transition-transform hover:scale-105"
                onClick={() => navigate('/patient/dashboard')}
            >
                <Activity className="text-white w-6 h-6" />
            </div>

            <div className="flex flex-col gap-4">
                <button
                    onClick={() => navigate('/patient/dashboard')}
                    className={`p-3 rounded-xl transition-all shadow-sm ${isActive('/patient/dashboard') ? 'bg-primary text-white shadow-primary/20' : 'text-gray-400 hover:bg-gray-50'}`}
                    title="Dashboard"
                >
                    <Activity className="w-6 h-6" />
                </button>

                <button
                    onClick={handleHistoryClick}
                    className={`p-3 rounded-xl transition-all ${isActive('/patient/history') ? 'bg-primary text-white shadow-primary/20' : 'text-gray-400 hover:bg-gray-50'}`}
                    title="Medical History"
                >
                    <History className="w-6 h-6" />
                </button>

                <button
                    onClick={() => navigate('/patient/settings')}
                    className={`p-3 rounded-xl transition-all ${isActive('/patient/settings') ? 'bg-primary text-white shadow-primary/20' : 'text-gray-400 hover:bg-gray-50'}`}
                    title="Settings"
                >
                    <Settings className="w-6 h-6" />
                </button>
            </div>

            <button
                onClick={logout}
                className="mt-auto p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Logout"
            >
                <LogOut className="w-6 h-6" />
            </button>
        </aside>
    );
};

export default PatientSidebar;
