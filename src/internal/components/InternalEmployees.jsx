import React, { useState, useEffect } from 'react';
import { DEPT_COLORS, renderDeptIcon } from './InternalSidebar';
import InternalChat from './InternalChat';
import { API } from '../InternalSystem';

const formatDelay = (ms) => {
    if (ms <= 0) return null;
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    if (hours > 0) return `${hours}ساعة و ${minutes}د`;
    return `${minutes}د`;
};

const InternalEmployees = ({ user, employees, tasks, onTaskUpdate, onEmployeeCreated, departments = [], onDepartmentsUpdated }) => {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeptModal, setShowDeptModal] = useState(false);
    const [selectedProfileId, setSelectedProfileId] = useState(null);
    const [profileTaskPage, setProfileTaskPage] = useState({ inProgress: 0, pending: 0, completed: 0 });
    const PROF_PAGE_SIZE = 5;
    const [newEmp, setNewEmp] = useState({ name: '', username: '', password: '', department: '' });
    const [newDept, setNewDept] = useState({ name: '', icon: '📁', color: 'blue' });
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    // Sync newEmp department with first available department
    useEffect(() => {
        if (!newEmp.department && departments.length > 0) {
            setNewEmp(prev => ({ ...prev, department: departments[0].name }));
        }
    }, [departments, newEmp.department]);

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API}/internal/employees`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEmp)
            });
            if (res.ok) {
                if (onEmployeeCreated) onEmployeeCreated();
                setShowAddModal(false);
                setNewEmp({ name: '', username: '', password: '', department: departments[0]?.name || '' });
            }
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const handleToggleStatus = async (id) => {
        try {
            const res = await fetch(`${API}/internal/employees/${id}/toggle-status`, {
                method: 'PATCH',
            });
            if (res.ok) if (onEmployeeCreated) onEmployeeCreated();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا الموظف نهائياً؟')) return;
        try {
            const res = await fetch(`${API}/internal/employees/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) if (onEmployeeCreated) onEmployeeCreated();
        } catch (err) { console.error(err); }
    };

    const handleAddDepartment = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API}/internal/departments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDept)
            });
            if (res.ok) {
                if (onDepartmentsUpdated) onDepartmentsUpdated();
                setNewDept({ name: '', icon: '📁', color: 'blue' });
            }
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const handleDeleteDepartment = async (id) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا القسم؟ قد يؤثر ذلك على المهام والموظفين.')) return;
        try {
            const res = await fetch(`${API}/internal/departments/${id}`, { method: 'DELETE' });
            if (res.ok) if (onDepartmentsUpdated) onDepartmentsUpdated();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10 animate-in fade-in duration-500 relative">
            <div className="pt-2 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-[var(--text-main)]">الموظفون</h1>
                    <p className="text-sm text-[var(--text-dim)] font-bold mt-1">إجمالي {employees.length} موظف في الفريق</p>
                </div>
                {user.role === 'Admin' && (
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowDeptModal(true)}
                            className="bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-main)] px-5 py-3 rounded-2xl font-black text-sm transition-all hover:bg-[var(--bg-card-hover)] flex items-center gap-2"
                        >
                            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            إدارة الأقسام
                        </button>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-[0_8px_24px_rgba(37,99,235,0.25)] flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                            إضافة موظف
                        </button>
                    </div>
                )}
            </div>

            {departments.map(deptObj => {
                const dept = deptObj.name;
                const deptEmps = employees.filter(e => e.department === dept);
                const colors = DEPT_COLORS[dept] || { bg: `bg-${deptObj.color}-500/10`, text: `text-${deptObj.color}-500`, dot: `bg-${deptObj.color}-500`, border: `border-${deptObj.color}-500/20` };
                const icon = renderDeptIcon(deptObj.icon);
                const deptTasks = tasks.filter(t => t.department === dept);
                const completedTasks = deptTasks.filter(t => t.status === 'completed' || t.status === 'verified').length;
                const progress = deptTasks.length ? Math.round((completedTasks / deptTasks.length) * 100) : 0;

                return (
                    <div key={deptObj.id} className="space-y-4">
                        {/* Dept Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 px-2">
                                <div className={`w-9 h-9 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center text-lg shadow-sm border ${colors.border}`}>
                                    {icon}
                                </div>
                                <div>
                                    <h2 className="font-black text-base text-[var(--text-main)]">{dept}</h2>
                                    <p className="text-[11px] text-[var(--text-dim)]">{deptEmps.length} موظف · {deptTasks.length} مهمة · {progress}% منجز</p>
                                </div>
                            </div>
                            <div className="hidden sm:flex items-center gap-3">
                                <div className="w-32 h-1.5 bg-[var(--border-light)] rounded-full overflow-hidden">
                                    <div className={`h-full ${colors.dot} rounded-full transition-all duration-700`} style={{ width: `${progress}%` }} />
                                </div>
                                <span className={`text-sm font-black ${colors.text}`}>{progress}%</span>
                            </div>
                        </div>

                        {/* Employee Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                     {deptEmps.map(emp => {
                                const empTasks = tasks.filter(t => t.assignedTo === emp.id);
                                const empCompleted = empTasks.filter(t => t.status === 'completed' || t.status === 'verified').length;
                                const empActive = empTasks.filter(t => t.status === 'in-progress').length;
                                const avatarUrl = emp.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(emp.name)}&backgroundColor=1e3a5f&textColor=60a5fa`;

                                // Monthly delay calculation
                                const now = new Date();
                                const currentMonthTasks = empTasks.filter(t => {
                                    const taskDate = new Date(t.deadline || t.createdAt);
                                    return taskDate.getMonth() === now.getMonth() && taskDate.getFullYear() === now.getFullYear();
                                });
                                const totalMonthlyDelayMs = currentMonthTasks.reduce((acc, t) => {
                                    if (!t.deadline) return acc;
                                    const delay = new Date(t.completedAt || new Date()) - new Date(t.deadline);
                                    return acc + (delay > 0 ? delay : 0);
                                }, 0);
                                const monthlyDelayText = formatDelay(totalMonthlyDelayMs);

                                return (
                                    <div key={emp.id} className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-5 flex flex-col gap-4 hover:bg-[var(--bg-card-hover)] transition-all">
                                        {/* Avatar & name – clickable for profile */}
                                        <div
                                            className="flex items-center gap-3 cursor-pointer group/profile"
                                            onClick={() => setSelectedProfileId(emp.id)}
                                            title="عرض الملف الشخصي"
                                        >
                                            <div className="relative">
                                                <img src={avatarUrl} className={`w-12 h-12 rounded-xl object-cover group-hover/profile:ring-2 group-hover/profile:ring-blue-500/50 transition-all ${!emp.isActive ? 'grayscale opacity-50' : ''}`} alt={emp.name} />
                                                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[var(--bg-main)] ${emp.status === 'online' && emp.isActive ? 'bg-green-500' : 'bg-gray-500'}`} />
                                            </div>
                                            <div className="min-w-0 text-right">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-black text-sm truncate text-[var(--text-main)] group-hover/profile:text-blue-400 transition-colors">{emp.name}</p>
                                                    {!emp.isActive && <span className="text-[9px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded-md font-black">معطل</span>}
                                                </div>
                                                <p className="text-[11px] text-[var(--text-dim)] truncate">
                                                    {!emp.isActive ? 'الحساب معطل حالياً' : (emp.status === 'online' ? 'متصل الآن' : 'غير متصل')}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[var(--border-light)]">
                                            <div className="text-center">
                                                <p className="text-lg font-black text-orange-400">{empActive}</p>
                                                <p className="text-[9px] text-[var(--text-dim)] font-bold uppercase">جارية</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-lg font-black text-green-400">{empCompleted}</p>
                                                <p className="text-[9px] text-[var(--text-dim)] font-bold uppercase">منجزة</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-lg font-black text-blue-400">{empTasks.length}</p>
                                                <p className="text-[9px] text-[var(--text-dim)] font-bold uppercase">الكل</p>
                                            </div>
                                        </div>

                                        {emp.totalWorkTime && emp.totalWorkTime !== '00:00:00' && (
                                            <div className="text-center bg-[var(--bg-input)] rounded-xl py-2">
                                                <p className="text-[9px] text-[var(--text-dim)] font-black uppercase mb-0.5">وقت العمل الكلي</p>
                                                <p className="font-mono text-xs font-bold text-[var(--text-main)]">{emp.totalWorkTime}</p>
                                            </div>
                                        )}

                                        {monthlyDelayText && (
                                            <div className="text-center bg-red-500/10 border border-red-500/20 rounded-xl py-2">
                                                <p className="text-[9px] text-red-400 font-black uppercase mb-0.5">تأخير هذا الشهر</p>
                                                <p className="font-mono text-xs font-black text-red-500">{monthlyDelayText}</p>
                                            </div>
                                        )}

                                        {/* Reward Points & Delay Debt */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="text-center bg-blue-500/10 border border-blue-500/20 rounded-xl py-2">
                                                <p className="text-[9px] text-blue-400 font-black uppercase mb-0.5">نقاط المكافأة</p>
                                                <p className="font-mono text-xs font-black text-blue-500">{emp.points || 0} ⭐</p>
                                            </div>
                                            <div className="text-center bg-amber-500/10 border border-amber-500/20 rounded-xl py-2">
                                                <p className="text-[9px] text-amber-400 font-black uppercase mb-0.5">رصيد التأخير</p>
                                                <p className="font-mono text-xs font-black text-amber-500">
                                                    {emp.delayDebtMinutes > 0 ? formatDelay(emp.delayDebtMinutes * 60000) : '0 د'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Admin Controls */}
                                        {user.role === 'Admin' && emp.id !== user.id && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleToggleStatus(emp.id)}
                                                    className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all border ${emp.isActive ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20'}`}
                                                >
                                                    {emp.isActive ? 'تعطيل الحساب' : 'تفعيل الحساب'}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(emp.id)}
                                                    className="flex-1 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 py-2 rounded-xl text-[10px] font-black hover:text-white transition-all shadow-sm"
                                                >
                                                    حذف الحساب
                                                </button>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => setSelectedEmployeeId(emp.id)}
                                            className="mt-auto bg-blue-600/10 hover:bg-blue-600 border border-blue-500/20 text-blue-500 hover:text-white py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 group"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                            تواصل مع الموظف
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}

            {/* Add Employee Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowAddModal(false)} />
                    <div className="relative w-full max-w-lg bg-[var(--bg-sidebar)] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-500/20 text-blue-500 rounded-2xl flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-[var(--text-main)]">إضافة موظف جديد</h3>
                                    <p className="text-sm text-[var(--text-dim)] font-bold">إنشاء حساب جديد للموظف في النظام</p>
                                </div>
                            </div>

                            <form onSubmit={handleAddEmployee} className="space-y-4 pt-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] text-[var(--text-dim)] font-black uppercase tracking-widest px-1">الاسم الكامل</label>
                                        <input
                                            required
                                            value={newEmp.name}
                                            onChange={e => setNewEmp({ ...newEmp, name: e.target.value })}
                                            className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl py-3 px-4 text-sm text-[var(--text-main)] font-bold outline-none focus:border-blue-500/60 transition-all"
                                            placeholder="أحمد علي"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] text-[var(--text-dim)] font-black uppercase tracking-widest px-1">القسم</label>
                                        <select
                                            value={newEmp.department}
                                            onChange={e => setNewEmp({ ...newEmp, department: e.target.value })}
                                            className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl py-3 px-4 text-sm text-[var(--text-main)] font-bold outline-none focus:border-blue-500/60 transition-all appearance-none"
                                        >
                                            {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] text-[var(--text-dim)] font-black uppercase tracking-widest px-1">اسم المستخدم</label>
                                    <input
                                        required
                                        value={newEmp.username}
                                        onChange={e => setNewEmp({ ...newEmp, username: e.target.value })}
                                        className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl py-3 px-4 text-sm text-[var(--text-main)] font-bold outline-none focus:border-blue-500/60 transition-all"
                                        placeholder="ahmed123"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] text-[var(--text-dim)] font-black uppercase tracking-widest px-1">كلمة المرور المؤقتة</label>
                                    <div className="relative">
                                        <input
                                            required
                                            type={showPassword ? "text" : "password"}
                                            value={newEmp.password}
                                            onChange={e => setNewEmp({ ...newEmp, password: e.target.value })}
                                            className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl py-3 px-4 pl-12 text-sm text-[var(--text-main)] font-bold outline-none focus:border-blue-500/60 transition-all font-mono"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all z-10"
                                        >
                                            {showPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                                    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                                    <line x1="2" y1="2" x2="22" y2="22" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 bg-white/5 hover:bg-white/10 text-[var(--text-main)] py-3.5 rounded-2xl font-black text-sm transition-all"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-2 bg-blue-600 hover:bg-blue-500 text-white py-3.5 px-8 rounded-2xl font-black text-sm transition-all shadow-[0_8px_24px_rgba(37,99,235,0.25)] disabled:opacity-50"
                                    >
                                        {loading ? 'جاري الإضافة...' : 'إضافة الموظف الآن'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Manage Departments Modal */}
            {showDeptModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowDeptModal(false)} />
                    <div className="relative w-full max-w-2xl bg-[var(--bg-sidebar)] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                        <div className="p-8 pb-4">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-purple-500/20 text-purple-500 rounded-2xl flex items-center justify-center text-xl">
                                        📁
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-[var(--text-main)]">إدارة الأقسام</h3>
                                        <p className="text-sm text-[var(--text-dim)] font-bold">إضافة أو حذف أقسام العمل</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowDeptModal(false)} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <form onSubmit={handleAddDepartment} className="bg-white/5 p-6 rounded-2xl space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] text-[var(--text-dim)] font-black uppercase tracking-widest px-1">اسم القسم</label>
                                        <input required value={newDept.name} onChange={e => setNewDept({ ...newDept, name: e.target.value })} className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl py-3 px-4 text-sm text-[var(--text-main)] font-bold outline-none focus:border-purple-500/60 transition-all" placeholder="مثلاً: المحاسبة" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] text-[var(--text-dim)] font-black uppercase tracking-widest px-1">اللون المميز</label>
                                        <select value={newDept.color} onChange={e => setNewDept({ ...newDept, color: e.target.value })} className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl py-3 px-4 text-sm text-[var(--text-main)] font-bold outline-none focus:border-purple-500/60 transition-all">
                                            <option value="blue">أزرق</option>
                                            <option value="purple">بنفسجي</option>
                                            <option value="green">أخضر</option>
                                            <option value="orange">برتقالي</option>
                                            <option value="red">أحمر</option>
                                            <option value="pink">وردي</option>
                                            <option value="cyan">سماوي</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Icon Picker */}
                                <div className="space-y-2">
                                    <label className="text-[11px] text-[var(--text-dim)] font-black uppercase tracking-widest px-1 block">الأيقونة</label>
                                    <div className="grid grid-cols-10 gap-1.5 p-3 bg-[var(--bg-input)] rounded-xl border border-[var(--border-light)]">
                                        {[
                                            { id:'video', d:'M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
                                            { id:'film', d:'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z' },
                                            { id:'play', d:'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664zM21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                                            { id:'camera', d:'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9zM15 13a3 3 0 11-6 0 3 3 0 016 0z' },
                                            { id:'mic', d:'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
                                            { id:'headphones', d:'M3 18v-6a9 9 0 0118 0v6M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z' },
                                            { id:'pen', d:'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
                                            { id:'brush', d:'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
                                            { id:'layout', d:'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
                                            { id:'palette', d:'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
                                            { id:'code', d:'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
                                            { id:'terminal', d:'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                                            { id:'globe', d:'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
                                            { id:'chip', d:'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18' },
                                            { id:'database', d:'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4' },
                                            { id:'megaphone', d:'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' },
                                            { id:'share', d:'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z' },
                                            { id:'trending', d:'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
                                            { id:'chart', d:'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
                                            { id:'at', d:'M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207' },
                                            { id:'doc', d:'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                                            { id:'edit', d:'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
                                            { id:'book', d:'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
                                            { id:'chat', d:'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
                                            { id:'hashtag', d:'M7 20l4-16m2 16l4-16M6 9h14M4 15h14' },
                                            { id:'star', d:'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
                                            { id:'lightning', d:'M13 10V3L4 14h7v7l9-11h-7z' },
                                            { id:'music', d:'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' },
                                            { id:'puzzle', d:'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z' },
                                            { id:'photo_alt', d:'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
                                        ].map(icon => (
                                            <button
                                                key={icon.id}
                                                type="button"
                                                title={icon.id}
                                                onClick={() => setNewDept({ ...newDept, icon: icon.d })}
                                                className={`w-full aspect-square flex items-center justify-center rounded-lg transition-all ${newDept.icon === icon.d ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-[var(--text-dim)] hover:bg-white/10 hover:text-[var(--text-main)]'}`}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon.d} />
                                                </svg>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-black text-sm transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50">
                                    {loading ? 'جاري الإضافة...' : 'إضافة القسم الآن'}
                                </button>
                            </form>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 pt-0 space-y-3">
                            <label className="text-[11px] text-[var(--text-dim)] font-black uppercase tracking-widest px-1 block mb-2">الأقسام الحالية ({departments.length})</label>
                            {departments.map(d => (
                                <div key={d.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl group hover:bg-white/10 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-${d.color}-500/10 text-${d.color}-500`}>
                                            {renderDeptIcon(d.icon)}
                                        </div>
                                        <div>
                                            <p className="font-black text-[var(--text-main)]">{d.name}</p>
                                            <p className="text-[10px] text-[var(--text-dim)] font-bold uppercase">{d.color}</p>
                                        </div>
                                    </div>
                                    {user.role === 'Admin' && (
                                        <button onClick={() => handleDeleteDepartment(d.id)} className="w-10 h-10 rounded-xl text-red-500 hover:bg-red-500/10 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Chat Overlay */}
            {selectedEmployeeId && (
                <div className="fixed inset-0 z-[60] flex justify-end">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedEmployeeId(null)} />
                    <div className="relative w-full max-w-2xl bg-[var(--bg-main)] border-l border-[var(--border-main)] shadow-2xl h-full flex flex-col animate-in slide-in-from-left duration-300">
                        <div className="flex items-center justify-between p-4 border-b border-[var(--border-main)] bg-[var(--bg-sidebar)]">
                            <h2 className="font-black text-lg text-[var(--text-main)]">المحادثة مع {employees.find(e => e.id === selectedEmployeeId)?.name}</h2>
                            <button onClick={() => setSelectedEmployeeId(null)} className="p-2 hover:bg-[var(--border-light)] rounded-lg transition-all text-[var(--text-main)]">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden p-4">
                            <InternalChat
                                user={user}
                                employees={employees}
                                tasks={tasks}
                                onAccept={onTaskUpdate}
                                onComplete={onTaskUpdate}
                                selectedChatId={selectedEmployeeId.toString()}
                                hideSidebar={true}
                                departments={departments}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Employee Profile Modal */}
            {selectedProfileId && (() => {
                const profEmp = employees.find(e => e.id === selectedProfileId);
                if (!profEmp) return null;
                const profTasks = tasks.filter(t => t.assignedTo === selectedProfileId);
                const profAvatar = profEmp.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profEmp.name)}&backgroundColor=1e3a5f&textColor=60a5fa`;
                const inProgress = profTasks.filter(t => t.status === 'in-progress');
                const pendingTasks = profTasks.filter(t => t.status === 'pending');
                const completedTasks = profTasks.filter(t => t.status === 'completed' || t.status === 'verified');

                const TaskRow = ({ t }) => (
                    <div className={`flex items-start justify-between p-3 rounded-xl border text-xs gap-2 ${t.priority === 'urgent' ? 'border-red-500/20 bg-red-500/5' : 'border-[var(--border-light)] bg-[var(--bg-input)]'}`}>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-[var(--text-main)] truncate">{t.title}</p>
                            {t.priority === 'urgent' && <span className="text-[8px] font-black text-red-400">⚡ مستعجل</span>}
                            {t.department && <p className="text-[9px] text-[var(--text-dim)] mt-0.5">{t.department}</p>}
                        </div>
                        <div className="flex flex-col items-end gap-0.5 shrink-0 text-[10px]">
                            {t.acceptedAt && <span className="text-orange-400 font-bold">▶ {new Date(t.acceptedAt).toLocaleDateString('ar-EG',{month:'short',day:'numeric'})}</span>}
                            {t.completedAt && <span className="text-green-400 font-bold">✓ {new Date(t.completedAt).toLocaleDateString('ar-EG',{month:'short',day:'numeric'})}</span>}
                            {t.deadline && (new Date(t.completedAt || new Date()) - new Date(t.deadline) > 0) && (
                                <span className="text-white font-black bg-red-500 px-2 py-0.5 rounded-md mt-1 shadow-sm">
                                    تأخير: {formatDelay(new Date(t.completedAt || new Date()) - new Date(t.deadline))}
                                </span>
                            )}
                        </div>
                    </div>
                );

                return (
                    <div className="fixed inset-0 z-[110] flex items-start justify-end p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProfileId(null)} />
                        <div className="relative w-full max-w-md bg-[var(--bg-sidebar)] border border-white/10 rounded-3xl shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col max-h-[95vh]">
                            <button onClick={() => setSelectedProfileId(null)} className="absolute top-4 left-4 p-2 hover:bg-white/5 rounded-xl transition-all text-[var(--text-dim)]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                            <div className="p-6 border-b border-white/10">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img src={profAvatar} className="w-16 h-16 rounded-2xl object-cover border-2 border-white/10" alt={profEmp.name} />
                                        <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[var(--bg-sidebar)] ${profEmp.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-[var(--text-main)]">{profEmp.name}</h3>
                                        <p className="text-sm text-[var(--text-dim)] font-bold">{profEmp.department}</p>
                                        <p className={`text-xs font-black mt-1 ${profEmp.status === 'online' ? 'text-green-400' : 'text-[var(--text-dim)]'}`}>
                                            {profEmp.status === 'online' ? '🟢 متصل الآن' : '⚫ غير متصل'}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 gap-2 mt-5">
                                    {[
                                        { label: 'جارية', value: inProgress.length, color: 'text-orange-400' },
                                        { label: 'معلقة', value: pendingTasks.length, color: 'text-yellow-400' },
                                        { label: 'منجزة', value: completedTasks.length, color: 'text-green-400' },
                                        { label: 'الكل', value: profTasks.length, color: 'text-blue-400' },
                                    ].map(s => (
                                        <div key={s.label} className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                                            <p className={`text-2xl font-black tabular-nums ${s.color}`}>{s.value}</p>
                                            <p className="text-[9px] text-[var(--text-dim)] font-bold uppercase mt-0.5">{s.label}</p>
                                        </div>
                                    ))}
                                </div>
                                {profEmp.totalWorkTime && profEmp.totalWorkTime !== '00:00:00' && (
                                    <div className="mt-3 bg-white/5 rounded-xl p-3 flex items-center justify-between border border-white/5">
                                        <span className="text-[11px] text-[var(--text-dim)] font-black uppercase">إجمالي وقت العمل</span>
                                        <span className="font-mono text-sm font-black text-[var(--text-main)]">{profEmp.totalWorkTime}</span>
                                    </div>
                                )}

                                {(() => {
                                    const now = new Date();
                                    const monthName = now.toLocaleDateString('ar-EG', { month: 'long' });
                                    const currentMonthTasks = profTasks.filter(t => {
                                        const taskDate = new Date(t.deadline || t.createdAt);
                                        return taskDate.getMonth() === now.getMonth() && taskDate.getFullYear() === now.getFullYear();
                                    });
                                    const totalDelayMs = currentMonthTasks.reduce((acc, t) => {
                                        if (!t.deadline) return acc;
                                        const delay = new Date(t.completedAt || new Date()) - new Date(t.deadline);
                                        return acc + (delay > 0 ? delay : 0);
                                    }, 0);
                                    const delayTxt = formatDelay(totalDelayMs);
                                    return (
                                        <div className="mt-2 bg-red-500/10 rounded-xl p-3 flex items-center justify-between border border-red-500/20">
                                            <span className="text-[11px] text-red-400 font-black uppercase">إجمالي تأخير {monthName}</span>
                                            <span className="font-mono text-sm font-black text-red-500">{delayTxt}</span>
                                        </div>
                                    );
                                })()}

                                {/* New Reward/Delay Metrics in Profile */}
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    <div className="bg-blue-500/10 rounded-xl p-3 flex flex-col items-center justify-center border border-blue-500/20">
                                        <span className="text-[10px] text-blue-400 font-black uppercase mb-1">نقاط المكافأة</span>
                                        <span className="text-lg font-black text-blue-500">{profEmp.points || 0} ⭐</span>
                                    </div>
                                    <div className="bg-amber-500/10 rounded-xl p-3 flex flex-col items-center justify-center border border-amber-500/20">
                                        <span className="text-[10px] text-amber-400 font-black uppercase mb-1">رصيد التأخير</span>
                                        <span className="text-sm font-black text-amber-500">
                                            {profEmp.delayDebtMinutes > 0 ? formatDelay(profEmp.delayDebtMinutes * 60000) : '0 د'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-5 space-y-5">
                                {profTasks.length === 0 ? (
                                    <div className="text-center py-12 text-[var(--text-dim)]">
                                        <svg className="w-12 h-12 mx-auto mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                        <p className="font-bold text-sm">لا توجد مهام مسندة</p>
                                    </div>
                                ) : (
                                    ((() => {
                                        const PaginatedGroup = ({ items, color, label, groupKey }) => {
                                            const page = profileTaskPage[groupKey] || 0;
                                            const totalPages = Math.ceil(items.length / PROF_PAGE_SIZE);
                                            const paged = items.slice(page * PROF_PAGE_SIZE, (page + 1) * PROF_PAGE_SIZE);
                                            return (
                                                <div>
                                                    <div className="flex items-center justify-between mb-2 px-1">
                                                        <p className={`text-[10px] font-black uppercase ${color}`}>{label} ({items.length})</p>
                                                        {totalPages > 1 && (
                                                            <div className="flex items-center gap-1">
                                                                <button disabled={page === 0} onClick={() => setProfileTaskPage(p => ({ ...p, [groupKey]: p[groupKey] - 1 }))} className="w-5 h-5 rounded-md bg-white/5 hover:bg-white/10 disabled:opacity-30 flex items-center justify-center transition-all">
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                                                                </button>
                                                                <span className="text-[9px] text-[var(--text-dim)] font-black">{page + 1}/{totalPages}</span>
                                                                <button disabled={page >= totalPages - 1} onClick={() => setProfileTaskPage(p => ({ ...p, [groupKey]: p[groupKey] + 1 }))} className="w-5 h-5 rounded-md bg-white/5 hover:bg-white/10 disabled:opacity-30 flex items-center justify-center transition-all">
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">{paged.map(t => <TaskRow key={t.id} t={t} />)}</div>
                                                </div>
                                            );
                                        };
                                        return (
                                            <>
                                                {inProgress.length > 0 && <PaginatedGroup items={inProgress} color="text-orange-400" label="⚙️ جارية" groupKey="inProgress" />}
                                                {pendingTasks.length > 0 && <PaginatedGroup items={pendingTasks} color="text-yellow-400" label="⏳ معلقة" groupKey="pending" />}
                                                {completedTasks.length > 0 && <PaginatedGroup items={completedTasks} color="text-green-400" label="✅ منجزة" groupKey="completed" />}
                                            </>
                                        );
                                    })())
                                )}
                            </div>
                            <div className="p-4 border-t border-white/10">
                                <button
                                    onClick={() => { setSelectedProfileId(null); setSelectedEmployeeId(selectedProfileId); }}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                    تواصل مع الموظف
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
};

export default InternalEmployees;
