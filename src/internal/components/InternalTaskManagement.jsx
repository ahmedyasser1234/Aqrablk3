import React, { useState, useEffect } from 'react';
import { API } from '../InternalSystem';
import { DEPT_COLORS, renderDeptIcon } from './InternalSidebar';

const avatarUrl = (name, avatar) => {
    if (avatar) return avatar;
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || '?')}&backgroundColor=1e3a5f&textColor=60a5fa`;
};

const fmtDateTime = (iso) => {
    if (!iso) return null;
    const d = new Date(iso);
    const date = d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
    const time = d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    return `${date} - ${time}`;
};

const StatusBadge = ({ task }) => {
    if (task.isPaused && task.status !== 'completed' && task.status !== 'verified') {
        return <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border text-gray-400 bg-gray-500/10 border-gray-500/20`}>موقوفة</span>;
    }
    const map = {
        pending: { label: 'معلق', classes: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
        scheduled: { label: 'مجدولة', classes: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
        'in-progress': { label: 'جاري', classes: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
        completed: { label: 'مكتمل', classes: 'text-green-400 bg-green-500/10 border-green-500/20' },
        verified: { label: 'تم الاستلام', classes: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    };
    const { label, classes } = map[task.status] || map.pending;
    return <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${classes}`}>{label}</span>;
};

const formatDuration = (start, end, isPaused, lastPausedAt, totalPausedMinutes = 0) => {
    if (!start) return '00:00:00';
    let endTime = end ? new Date(end).getTime() : new Date().getTime();
    
    if (isPaused && lastPausedAt) {
        endTime = new Date(lastPausedAt).getTime();
    }
    
    let diff = Math.max(0, endTime - new Date(start).getTime());
    diff -= (totalPausedMinutes * 60000);
    diff = Math.max(0, diff);

    const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
    const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

const formatDelay = (ms) => {
    if (ms <= 0) return null;
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    if (hours > 0) return `تأخير: ${hours} ساعة و ${minutes} دقيقة`;
    return `تأخير: ${minutes} دقيقة`;
};

const InternalTaskManagement = ({ user, tasks, employees, onTaskUpdate, onTaskDelete, onTaskCreate, departments = [] }) => {
    const [showModal, setShowModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterDate, setFilterDate] = useState('all');
    const [submitting, setSubmitting] = useState(false);
    const [tick, setTick] = useState(0);
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 9;
    const [newTask, setNewTask] = useState({ title: '', description: '', department: '', assignedTo: '', priority: 'normal', deadline: '', startTime: '' });

    // Ensure first department is selected by default if none
    useEffect(() => {
        if (!newTask.department && departments.length > 0) {
            setNewTask(prev => ({ ...prev, department: departments[0].name }));
        }
    }, [departments, newTask.department]);

    // Live timer
    useEffect(() => {
        const t = setInterval(() => setTick(p => p + 1), 1000);
        return () => clearInterval(t);
    }, []);

    const isAdmin = user.role === 'Admin';
    const isChairman = user.role === 'Chairman';

    const filteredTasks = tasks.filter(t => {
        const matchStatus = filterStatus === 'all' || t.status === filterStatus;

        let matchDate = true;
        if (filterDate !== 'all') {
            const taskDate = new Date(t.startTime || t.createdAt);
            const now = new Date();

            if (filterDate === 'today') {
                matchDate = taskDate.toDateString() === now.toDateString();
            } else if (filterDate === 'week') {
                // Current week (from Sunday)
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay());
                startOfWeek.setHours(0, 0, 0, 0);
                matchDate = taskDate >= startOfWeek;
            } else if (filterDate === 'month') {
                matchDate = taskDate.getMonth() === now.getMonth() && taskDate.getFullYear() === now.getFullYear();
            }
        }

        return matchStatus && matchDate;
    });

    const totalPages = Math.ceil(filteredTasks.length / PAGE_SIZE);
    const pagedTasks = filteredTasks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleAccept = async (taskId) => {
        const res = await fetch(`${API}/internal/tasks/${taskId}/accept`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ employeeId: user.id })
        });
        if (res.ok) onTaskUpdate(await res.json());
    };

    const handleComplete = async (taskId) => {
        const res = await fetch(`${API}/internal/tasks/${taskId}/complete`, { method: 'PATCH' });
        if (res.ok) onTaskUpdate(await res.json());
    };

    const handleVerify = async (taskId) => {
        const res = await fetch(`${API}/internal/tasks/${taskId}/verify`, { method: 'PATCH' });
        if (res.ok) onTaskUpdate(await res.json());
    };

    const handlePause = async (taskId) => {
        const res = await fetch(`${API}/internal/tasks/${taskId}/pause`, { method: 'PATCH' });
        if (res.ok) onTaskUpdate(await res.json());
    };

    const handleResume = async (taskId) => {
        const res = await fetch(`${API}/internal/tasks/${taskId}/resume`, { method: 'PATCH' });
        if (res.ok) onTaskUpdate(await res.json());
    };

    const handleDelete = async (taskId) => {
        if (!window.confirm('هل أنت متأكد من حذف هذه المهمة؟')) return;
        const res = await fetch(`${API}/internal/tasks/${taskId}`, { method: 'DELETE' });
        if (res.ok) onTaskDelete(taskId);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const body = { 
            ...newTask, 
            assignedTo: parseInt(newTask.assignedTo) || null,
            creatorId: user.id,
            creatorName: user.name
        };
        const res = await fetch(`${API}/internal/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (res.ok) {
            onTaskCreate(await res.json());
            setShowModal(false);
            setNewTask({ title: '', description: '', department: departments[0]?.name || '', assignedTo: '', priority: 'normal', deadline: '', startTime: '' });
        }
        setSubmitting(false);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div>
                    <h1 className="text-3xl font-black text-[var(--text-main)]">المهام</h1>
                    <p className="text-sm text-[var(--text-dim)] font-bold mt-1">
                        {isAdmin || isChairman ? 'إدارة مهام الفريق' : 'مهامك المُسندة إليك'}
                    </p>
                </div>
                <div className="flex gap-3">
                    <select
                        value={filterStatus}
                        onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
                        className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-blue-500/50 transition-all text-[var(--text-main)] [&>option]:bg-[var(--bg-modal)] [&>option]:text-[var(--text-main)]"
                    >
                        <option value="all">كل الحالات</option>
                        <option value="pending">معلقة</option>
                        <option value="scheduled">مجدولة</option>
                        <option value="in-progress">جارية</option>
                        <option value="completed">مكتملة</option>
                        <option value="verified">تم الاستلام</option>
                    </select>

                    <select
                        value={filterDate}
                        onChange={e => { setFilterDate(e.target.value); setPage(1); }}
                        className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-blue-500/50 transition-all text-[var(--text-main)] [&>option]:bg-[var(--bg-modal)] [&>option]:text-[var(--text-main)]"
                    >
                        <option value="all">كل الأوقات</option>
                        <option value="today">اليوم</option>
                        <option value="week">هذا الأسبوع</option>
                        <option value="month">هذا الشهر</option>
                    </select>
                    {isAdmin ? (
                        <div className="flex gap-2">
                             <button
                                onClick={() => {
                                    const now = new Date();
                                    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                                    const nowISO = now.toISOString().slice(0, 16);
                                    setNewTask({ 
                                        title: '', 
                                        description: '', 
                                        department: departments[0]?.name || '', 
                                        assignedTo: '', 
                                        priority: 'urgent', 
                                        deadline: '', 
                                        startTime: nowISO 
                                    });
                                    setShowModal(true);
                                }}
                                className="bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 shadow-[0_8px_20px_rgba(220,38,38,0.25)] transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                مهمة مستعجلة
                            </button>
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 shadow-[0_8px_20px_var(--shadow-btn)] transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                                مهمة جديدة
                            </button>
                        </div>
                    ) : isChairman ? null : (
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    const now = new Date();
                                    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                                    const nowISO = now.toISOString().slice(0, 16);
                                    setNewTask({ 
                                        title: '', 
                                        description: '', 
                                        department: user.department || '', 
                                        assignedTo: user.id || '', 
                                        priority: 'normal', 
                                        deadline: '', 
                                        startTime: nowISO 
                                    });
                                    setShowModal(true);
                                }}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 shadow-[0_8px_20px_var(--shadow-btn)] transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                                إضافة نشاط ذاتي
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Task Grid */}
            {filteredTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-[var(--text-dim)]">
                    <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    <p className="font-bold">لا توجد مهام في هذه الفئة</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {pagedTasks.map(task => {
                        const emp = employees.find(e => e.id === task.assignedTo);
                        const colors = DEPT_COLORS[task.department] || {};
                        const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'completed' && task.status !== 'verified';
                        const delayMs = task.deadline ? (new Date(task.completedAt || new Date()) - new Date(task.deadline)) : 0;
                        const delayText = formatDelay(delayMs);
                        const isInProgress = task.status === 'in-progress';
                        const isDone = task.status === 'completed' || task.status === 'verified';
                        const isOpenDept = task.status === 'pending' && !task.assignedTo && user.department === task.department;

                        return (
                            <div key={task.id} className={`bg-[var(--bg-card)] border rounded-2xl p-5 flex flex-col gap-4 transition-all hover:bg-[var(--bg-card-hover)] ${isOverdue ? 'border-red-500/40' : task.priority === 'urgent' ? 'border-red-500/30' : 'border-[var(--border-main)]'}`}>
                                {/* Top */}
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <StatusBadge task={task} />
                                            <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${task.priority === 'urgent' ? 'text-red-400 bg-red-500/10 border border-red-500/20' : 'text-[var(--text-dim)] bg-[var(--bg-card-hover)] border border-[var(--border-light)]'}`}>
                                                {task.priority === 'urgent' ? '⚡ مستعجل' : 'عادي'}
                                            </span>
                                            {isOverdue && <span className="text-[10px] font-black text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-lg">متأخر!</span>}
                                        </div>
                                        <h3 className="font-bold text-base leading-snug text-[var(--text-main)]">{task.title}</h3>
                                        <p className="text-[10px] text-[var(--text-dim)] mt-1">
                                            {task.status === 'scheduled' ? 'موعد البدء: ' : 'تاريخ الإنشاء: '}
                                            {fmtDateTime(task.status === 'scheduled' ? task.startTime : task.createdAt)}
                                        </p>
                                        {delayText && (
                                            <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-red-500/10 border border-red-500/20 text-[10px] font-black text-red-400">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                {delayText}
                                            </div>
                                        )}
                                    </div>
                                    {isAdmin && !isChairman && (
                                        <button onClick={() => handleDelete(task.id)} className="w-8 h-8 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 flex items-center justify-center transition-all shrink-0">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    )}
                                </div>

                                {task.description && (
                                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">{task.description}</p>
                                )}

                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold self-start ${colors.bg} ${colors.text}`}>
                                    <span className="opacity-80">{renderDeptIcon(departments.find(d => d.name === task.department)?.icon)}</span>
                                    {task.department}
                                </div>

                                {/* Acceptance & completion timestamps */}
                                {(task.acceptedAt || task.completedAt || task.verifiedAt) && (
                                    <div className="space-y-1.5 text-[10px] text-[var(--text-dim)] bg-[var(--bg-input)] rounded-xl px-3 py-2.5 border border-[var(--border-light)]">
                                        {task.acceptedAt && (
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-orange-400 font-black">▶ بدأ:</span>
                                                <span>{fmtDateTime(task.acceptedAt)}</span>
                                            </div>
                                        )}
                                        {task.completedAt && (
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-green-400 font-black">✓ سُلِّم:</span>
                                                <span>{fmtDateTime(task.completedAt)}</span>
                                            </div>
                                        )}
                                        {task.verifiedAt && (
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-blue-400 font-black">✔✔ استُلم:</span>
                                                <span>{fmtDateTime(task.verifiedAt)}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Timer / Duration */}
                                {isInProgress && task.acceptedAt && (
                                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-3 text-center">
                                        <p className="text-[10px] text-orange-400 font-black uppercase mb-1">الوقت المنقضي</p>
                                        <p className="text-2xl font-mono font-black text-orange-400 tabular-nums">{formatDuration(task.acceptedAt, null, task.isPaused, task.lastPausedAt, task.totalPausedMinutes)}</p>
                                    </div>
                                )}
                                {isDone && task.acceptedAt && task.completedAt && (
                                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 text-center">
                                        <p className="text-[10px] text-green-400 font-black uppercase mb-1">وقت الإنجاز</p>
                                        <p className="text-xl font-mono font-black text-green-400 tabular-nums">{formatDuration(task.acceptedAt, task.completedAt, task.isPaused, task.lastPausedAt, task.totalPausedMinutes)}</p>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="flex items-center justify-between gap-3 pt-3 border-t border-[var(--border-main)] mt-auto">
                                    <div className="flex items-center gap-2 min-w-0">
                                        {emp ? (
                                            <>
                                                <img src={avatarUrl(emp.name, emp.avatar)} className="w-8 h-8 rounded-lg object-cover shrink-0" alt="" />
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold leading-none text-[var(--text-main)] truncate">{emp.name}</p>
                                                    <p className="text-[9px] text-[var(--text-dim)] mt-0.5 truncate">{emp.department}</p>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-8 h-8 rounded-lg bg-[var(--bg-input)] border border-dashed border-[var(--border-light)] flex items-center justify-center">
                                                    <span className="text-[10px] text-[var(--text-dim)]">?</span>
                                                </div>
                                                <p className="text-xs text-[var(--text-dim)] font-bold">مفتوح للقسم</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        {task.deadline && (
                                            <span className="text-[9px] text-[var(--text-dim)] font-bold bg-[var(--bg-input)] px-2 py-1 rounded-lg border border-[var(--border-light)]">
                                                ⏰ {new Date(task.deadline).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })}
                                            </span>
                                        )}

                                        {isAdmin && !isChairman && task.status === 'completed' && (
                                            <button onClick={() => handleVerify(task.id)} className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-3 py-2 rounded-lg transition-all shadow-lg shadow-blue-600/20 whitespace-nowrap">
                                                تاكيد الاستلام
                                            </button>
                                        )}

                                        {isAdmin && !isChairman && task.status === 'in-progress' && !task.isPaused && (
                                            <button onClick={() => handlePause(task.id)} className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-black px-3 py-2 rounded-lg transition-all shadow-lg shadow-orange-600/20 whitespace-nowrap">
                                                إيقاف مؤقت
                                            </button>
                                        )}

                                        {isAdmin && !isChairman && task.status === 'in-progress' && task.isPaused && (
                                            <button onClick={() => handleResume(task.id)} className="bg-green-600 hover:bg-green-500 text-white text-xs font-black px-3 py-2 rounded-lg transition-all shadow-lg shadow-green-600/20 whitespace-nowrap">
                                                استئناف
                                            </button>
                                        )}

                                        {!isAdmin && !isChairman && (
                                            <>
                                                {isOpenDept && (
                                                    <button onClick={() => handleAccept(task.id)} className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-black px-3 py-2 rounded-lg transition-all whitespace-nowrap">
                                                        استلم المهمة 🙋
                                                    </button>
                                                )}
                                                {task.status === 'pending' && task.assignedTo === user.id && (
                                                    <button onClick={() => handleAccept(task.id)} className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-black px-3 py-2 rounded-lg transition-all">
                                                        بدء العمل
                                                    </button>
                                                )}
                                                {task.status === 'in-progress' && task.assignedTo === user.id && (
                                                    <button onClick={() => handleComplete(task.id)} className="bg-green-600 hover:bg-green-500 text-white text-xs font-black px-3 py-2 rounded-lg transition-all">
                                                        تسليم
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 rounded-xl text-sm font-black transition-all border border-[var(--border-light)] text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-input)] disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`w-9 h-9 rounded-xl text-sm font-black transition-all border ${
                                p === page 
                                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' 
                                    : 'border-[var(--border-light)] text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-input)]'
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 rounded-xl text-sm font-black transition-all border border-[var(--border-light)] text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-input)] disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                </div>
            )}

            {/* Create Task Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative bg-[var(--bg-modal)] border border-[var(--border-light)] rounded-2xl p-8 w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto text-[var(--text-main)]">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black">مهمة جديدة</h2>
                            <button onClick={() => setShowModal(false)} className="w-8 h-8 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg hover:bg-[var(--bg-card-hover)] flex items-center justify-center transition-all">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="sm:col-span-2 space-y-1.5">
                                    <label className="text-[11px] text-[var(--text-dim)] font-bold uppercase tracking-widest">العنوان *</label>
                                    <input required value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl py-3 px-4 text-sm text-[var(--text-main)] font-normal outline-none focus:border-blue-500/60 transition-all placeholder-[var(--text-dim)]" placeholder="عنوان المهمة" />
                                </div>
                                
                                {!isAdmin && (
                                    <div className="sm:col-span-2 bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex flex-col gap-1">
                                        <p className="text-xs text-blue-400 font-bold">هذه المهمة ستُسند إليك مباشرة لتسجيل نشاطك الحالي.</p>
                                        <p className="text-[10px] text-blue-400/80">يرجى كتابة تفاصيل النشاط بدقة في حقل "الوصف" ليتمكن المدير من متابعتها وحساب وقتك بشكل صحيح.</p>
                                    </div>
                                )}
                                
                                {isAdmin && (
                                    <>
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] text-[var(--text-dim)] font-bold uppercase tracking-widest">القسم *</label>
                                            <select value={newTask.department} onChange={e => setNewTask({ ...newTask, department: e.target.value, assignedTo: '' })} className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl py-3 px-4 text-sm text-[var(--text-main)] font-normal outline-none focus:border-blue-500/60 transition-all [&>option]:bg-[var(--bg-modal)]">
                                                <option value="">اختر القسم</option>
                                                {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] text-[var(--text-dim)] font-bold uppercase tracking-widest">الموظف *</label>
                                            <select required value={newTask.assignedTo} onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })} className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl py-3 px-4 text-sm text-[var(--text-main)] font-normal outline-none focus:border-blue-500/60 transition-all [&>option]:bg-[var(--bg-modal)]">
                                                <option value="">اختر موظفاً</option>
                                                {employees.filter(e => e.department === newTask.department).map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                            </select>
                                        </div>
                                    </>
                                )}
                                
                                <div className="space-y-1.5">
                                    <label className="text-[11px] text-[var(--text-dim)] font-bold uppercase tracking-widest">موعد بداية المهمة</label>
                                    <input type="datetime-local" min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)} value={newTask.startTime} onChange={e => setNewTask({ ...newTask, startTime: e.target.value })} className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl py-3 px-4 text-sm text-[var(--text-main)] font-normal outline-none focus:border-blue-500/60 transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] text-[var(--text-dim)] font-bold uppercase tracking-widest">الموعد النهائي</label>
                                    <input type="datetime-local" min={newTask.startTime || new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)} value={newTask.deadline} onChange={e => setNewTask({ ...newTask, deadline: e.target.value })} className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl py-3 px-4 text-sm text-[var(--text-main)] font-normal outline-none focus:border-blue-500/60 transition-all" />
                                </div>
                                <div className="sm:col-span-2 space-y-1.5">
                                    <label className="text-[11px] text-[var(--text-dim)] font-bold uppercase tracking-widest">الوصف {isAdmin ? '' : '*'}</label>
                                    <textarea required={!isAdmin} rows={3} value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} className="w-full bg-[var(--bg-input)] border border-[var(--border-light)] rounded-xl py-3 px-4 text-sm text-[var(--text-main)] font-normal outline-none focus:border-blue-500/60 transition-all resize-none placeholder-[var(--text-dim)]" placeholder={isAdmin ? "تفاصيل المهمة (اختياري)" : "من فضلك اشرح ما تقوم به بالتفصيل لكي يعتمده المدير..."} />
                                </div>
                            </div>
                            <button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-black text-sm transition-all disabled:opacity-50 shadow-[0_8px_24px_var(--shadow-btn)]">
                                {submitting ? 'جاري الحفظ...' : 'إنشاء المهمة'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InternalTaskManagement;
