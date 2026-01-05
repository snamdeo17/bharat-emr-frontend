import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Activity, Users, Calendar,
    History, Settings, LogOut, Menu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DoctorSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const menuItems = [
        { icon: <Activity />, label: 'Dashboard', path: '/doctor/dashboard' },
        { icon: <Users />, label: 'Patient Registry', path: '/doctor/patients' },
        { icon: <Calendar />, label: 'Schedule', path: '/doctor/schedule' },
        { icon: <History />, label: 'Medical History', path: '/doctor/history' },
        { icon: <Settings />, label: 'Settings', path: '/doctor/settings' },
    ];

    return (
        <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-white border-r border-gray-100 flex flex-col transition-all h-screen sticky top-0 z-50 flex-shrink-0 shadow-sm`}>
            <div className="p-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl flex-shrink-0 shadow-sm">
                        <Activity className="text-white w-6 h-6" />
                    </div>
                    {sidebarOpen && <span className="font-extrabold text-xl tracking-tight text-gray-900 whitespace-nowrap">Bharat EMR</span>}
                </div>
                {sidebarOpen && (
                    <button onClick={() => setSidebarOpen(false)} className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400">
                        <Menu className="w-5 h-5" />
                    </button>
                )}
                {!sidebarOpen && (
                    <button onClick={() => setSidebarOpen(true)} className="mt-2 p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 block mx-auto">
                        <Menu className="w-5 h-5" />
                    </button>
                )}
            </div>

            <div className="flex-1 px-4 mt-6">
                <div className="flex flex-col gap-1">
                    {menuItems.map((item, idx) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={idx}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-4 px-4 py-3-5 rounded-xl font-bold transition-all ${isActive
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                                    }`}
                            >
                                <div className="flex-shrink-0">{React.cloneElement(item.icon, { className: 'w-5 h-5' })}</div>
                                {sidebarOpen && <span className="whitespace-nowrap font-bold">{item.label}</span>}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="p-4 mt-auto">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-4 px-4 py-3-5 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all"
                >
                    <div className="flex-shrink-0"><LogOut className="w-5 h-5" /></div>
                    {sidebarOpen && <span className="whitespace-nowrap font-bold">Sign Out</span>}
                </button>
            </div>
        </aside>
    );
};

export default DoctorSidebar;
