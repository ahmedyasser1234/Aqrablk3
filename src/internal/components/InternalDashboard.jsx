import React, { useState, useRef, useEffect } from 'react';
import { DEPT_COLORS, DEPT_ICONS, renderDeptIcon } from './InternalSidebar';

const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Math.max(0, new Date() - new Date(dateStr));
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'الآن';
    if (mins < 60) return `منذ ${mins} د`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `منذ ${hrs} س`;
    return `منذ ${Math.floor(hrs / 24)} ي`;
};

const StatCard = ({ label, value, color, icon }) => (
    <div className={`relative overflow-hidden rounded-2xl p-6 border ${color.border} bg-[var(--bg-card)] flex flex-col gap-3 shadow-sm`}>
        <div className={`w-10 h-10 rounded-xl ${color.bg} ${color.text} flex items-center justify-center`}>{icon}</div>
        <div>
            <p className="text-3xl font-black tabular-nums text-[var(--text-main)]">{value}</p>
            <p className="text-xs text-[var(--text-dim)] font-bold uppercase tracking-widest mt-1">{label}</p>
        </div>
    </div>
);

const InternalDashboard = ({ user, tasks, employees, superadminOnline, chairmanOnline, departments = [], adminAvatar }) => {
    const [showOnlineDropdown, setShowOnlineDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowOnlineDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const totalTasks = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed' || t.status === 'verified').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const onlinePeople = [];
    const seenIds = new Set();

    if (superadminOnline && user.id !== 0) {
        onlinePeople.push({ 
            id: 'admin', 
            name: 'المدير (المسؤول)', 
            role: 'مدير النظام', 
            status: 'online',
            lastSeen: null,
            avatar: adminAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=Admin&backgroundColor=1e3a5f&textColor=60a5fa`
        });
        seenIds.add('admin');
    }
    
    if (chairmanOnline && user.role !== 'Chairman') {
        onlinePeople.push({
            id: 'chairman',
            name: 'مجلس الإدارة',
            role: 'مجلس الإدارة',
            status: 'online',
            lastSeen: null,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=Chairman&backgroundColor=ea580c&textColor=ffffff`
        });
        seenIds.add('chairman');
    }

    employees.filter(e => e.id !== user.id).forEach(emp => {
        if (!seenIds.has(emp.id)) {
            onlinePeople.push({
                id: emp.id,
                name: emp.name,
                role: emp.department,
                status: emp.status,
                lastSeen: emp.lastSeen,
                avatar: emp.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(emp.name)}&backgroundColor=1e3a5f&textColor=60a5fa`
            });
            seenIds.add(emp.id);
        }
    });

    const onlineEmps = onlinePeople.filter(p => p.status === 'online').length;

    const stats = [
        {
            label: 'إجمالي المهام', value: totalTasks, color: { bg: 'bg-blue-500/20', text: 'text-blue-500', border: 'border-blue-500/10' },
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
        },
        {
            label: 'قيد التنفيذ', value: inProgress, color: { bg: 'bg-orange-500/20', text: 'text-orange-500', border: 'border-orange-500/10' },
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        },
        {
            label: 'مكتملة', value: completed, color: { bg: 'bg-green-500/20', text: 'text-green-500', border: 'border-green-500/10' },
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        },
        {
            label: 'متصل الآن', value: onlineEmps, color: { bg: 'bg-purple-500/20', text: 'text-purple-500', border: 'border-purple-500/10' },
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
        },
    ];

    const deptProgress = departments.map(deptObj => {
        const dept = deptObj.name;
        const deptTasks = tasks.filter(t => t.department === dept);
        const done = deptTasks.filter(t => t.status === 'completed' || t.status === 'verified').length;
        return { name: dept, percent: deptTasks.length ? Math.round((done / deptTasks.length) * 100) : 0, total: deptTasks.length, icon: deptObj.icon, color: deptObj.color };
    });

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pt-2">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-[var(--text-main)]">
                        {(user.role === 'Admin' || user.role === 'Chairman') ? 'نظرة عامة' : `مرحباً، ${user.name}`}
                    </h1>
                    <p className="text-[var(--text-dim)] text-sm font-bold mt-1">
                        {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className="relative" ref={dropdownRef}>
                    <button 
                        onClick={() => setShowOnlineDropdown(!showOnlineDropdown)}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-xl shrink-0 transition-all border
                            ${showOnlineDropdown 
                                ? 'bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/20' 
                                : 'bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20'}
                        `}
                    >
                        <span className={`w-2 h-2 rounded-full ${showOnlineDropdown ? 'bg-white' : 'bg-green-500'} animate-pulse`}></span>
                        <span className="text-sm font-black">{onlineEmps} متصل</span>
                    </button>

                    {showOnlineDropdown && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-[var(--bg-sidebar)] border border-white/10 rounded-2xl p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            <h3 className="text-xs font-black text-[var(--text-dim)] uppercase tracking-widest mb-3 px-1">حالة الفريق</h3>
                            <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                                {onlinePeople.sort((a, b) => (a.status === 'online' ? -1 : 1)).map(person => (
                                    <div key={`${person.id}-${person.name}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
                                        <div className="relative">
                                            <img src={person.avatar} className="w-8 h-8 rounded-lg" alt="" />
                                            <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${person.status === 'online' ? 'bg-green-500' : 'bg-gray-500'} rounded-full border-2 border-[var(--bg-sidebar)]`} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-sm font-black text-[var(--text-main)] truncate">{person.name}</p>
                                                {person.status !== 'online' && person.lastSeen && (
                                                    <span className="text-[9px] text-[var(--text-dim)] font-bold shrink-0">{timeAgo(person.lastSeen)}</span>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-[var(--text-dim)] font-bold truncate">{person.role}</p>
                                        </div>
                                    </div>
                                ))}
                                {onlinePeople.length === 0 && (
                                    <p className="text-center py-4 text-xs text-[var(--text-dim)] font-bold">لا يوجد أحد متصل</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => <StatCard key={i} {...s} />)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Online Team Section */}
                <div className="lg:col-span-2 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-6 space-y-4 shadow-sm h-fit">
                    <div className="flex items-center justify-between">
                        <h2 className="font-black text-lg text-[var(--text-main)]">المتصلون الآن</h2>
                        <span className="bg-green-500/10 text-green-500 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest leading-none">Live</span>
                    </div>
                    <div className="space-y-3">
                        {superadminOnline && user.id !== 0 && (
                            <div className="flex items-center gap-3 p-2 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                <div className="relative">
                                    <img src={adminAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=Admin&backgroundColor=1e3a5f&textColor=60a5fa`} className="w-10 h-10 rounded-xl" alt="" />
                                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--bg-card)]" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-[var(--text-main)]">المدير (المسؤول)</p>
                                    <p className="text-[10px] text-blue-500 font-bold">متصل الآن</p>
                                </div>
                            </div>
                        )}
                        {employees.filter(e => e.status === 'online' && e.id !== user.id).map(emp => (
                            <div key={emp.id} className="flex items-center gap-3 p-2 rounded-xl bg-[var(--bg-card-hover)] border border-[var(--border-light)]">
                                <div className="relative">
                                    <img src={emp.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(emp.name)}&backgroundColor=1e3a5f&textColor=60a5fa`} className="w-10 h-10 rounded-xl" alt="" />
                                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--bg-card)]" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-[var(--text-main)]">{emp.name}</p>
                                    <p className="text-[10px] text-[var(--text-dim)] font-bold">{emp.department}</p>
                                </div>
                            </div>
                        ))}
                        {(onlineEmps - (employees.find(e => e.id === user.id && e.status === 'online') || (user.id === 0 && superadminOnline) ? 1 : 0)) === 0 && (
                            <div className="py-8 text-center text-[var(--text-dim)] text-sm font-bold opacity-50">
                                لا يوجد أشخاص آخرون متصلون حالياً
                            </div>
                        )}
                    </div>
                </div>

                {/* Department Progress */}
                <div className="lg:col-span-3 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-6 space-y-6 shadow-sm">
                    <h2 className="font-black text-lg text-[var(--text-main)]">تقدم الأقسام</h2>
                    <div className="space-y-5">
                        {deptProgress.map((dept, i) => {
                            const colors = DEPT_COLORS[dept.name] || { bg: `bg-${dept.color}-500/10`, text: `text-${dept.color}-500`, dot: `bg-${dept.color}-500` };
                            const icon = dept.icon || '📁';
                            return (
                                <div key={i} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-7 h-7 rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center`}>
                                                {renderDeptIcon(icon)}
                                            </div>
                                            <span className="text-sm font-bold text-[var(--text-main)]">{dept.name}</span>
                                        </div>
                                        <span className={`text-sm font-black ${colors.text}`}>{dept.percent}%</span>
                                    </div>
                                    <div className="h-2 bg-[var(--border-light)] rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${colors.dot} rounded-full transition-all duration-1000`}
                                            style={{ width: `${dept.percent}%` }}
                                        />
                                    </div>
                                    <p className="text-[11px] text-[var(--text-dim)] font-bold">{dept.total} مهمة</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Tasks */}
                <div className="lg:col-span-2 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-6 space-y-4 shadow-sm">
                    <h2 className="font-black text-lg text-[var(--text-main)]">آخر المهام</h2>
                    <div className="space-y-3">
                        {tasks.slice(0, 6).map(task => {
                            const emp = employees.find(e => e.id === task.assignedTo);
                            const statusClasses = {
                                verified: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
                                completed: 'text-green-500 bg-green-500/10 border-green-500/20',
                                'in-progress': 'text-orange-500 bg-orange-500/10 border-orange-500/20',
                                pending: 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20',
                            };
                            const statusLabels = { verified: 'تم الاستلام', completed: 'مكتمل', 'in-progress': 'جاري', pending: 'معلق' };
                            return (
                                <div key={task.id} className="flex items-center justify-between gap-3 py-3 border-b border-[var(--border-light)] last:border-0">
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold truncate text-[var(--text-main)]">{task.title}</p>
                                        <p className="text-xs text-[var(--text-dim)]">{emp?.name}</p>
                                    </div>
                                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg border shrink-0 ${statusClasses[task.status]}`}>
                                        {statusLabels[task.status]}
                                    </span>
                                </div>
                            );
                        })}
                        {tasks.length === 0 && <p className="text-[var(--text-dim)] text-sm text-center py-8">لا توجد مهام بعد</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InternalDashboard;
