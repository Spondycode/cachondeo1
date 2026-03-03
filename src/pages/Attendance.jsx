import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Save, Plus, ArrowLeft, Calendar, Users, Trash2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Attendance = () => {
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);
    const [rehearsalDates, setRehearsalDates] = useState([]); // Array of ISO strings YYYY-MM-DD
    const [attendance, setAttendance] = useState({}); // { [dateString]: { [memberId]: boolean } }
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        // Load members
        let storedMembers = JSON.parse(localStorage.getItem('choir_members') || '[]');

        // Add sample members if empty for demo
        if (storedMembers.length === 0) {
            storedMembers = [
                { id: 'm1', name: 'John Smith', voicePart: 'Tenor' },
                { id: 'm2', name: 'Emily Davis', voicePart: 'Soprano' },
                { id: 'm3', name: 'Michael Brown', voicePart: 'Bass' },
                { id: 'm4', name: 'Sarah Wilson', voicePart: 'Alto' }
            ];
            localStorage.setItem('choir_members', JSON.stringify(storedMembers));
        }
        setMembers(storedMembers);

        // Load attendance data
        const storedAttendance = JSON.parse(localStorage.getItem('choir_attendance') || '{}');
        const dates = Object.keys(storedAttendance).sort((a, b) => new Date(b) - new Date(a));

        // If no dates, add a default one for today
        if (dates.length === 0) {
            const today = new Date().toISOString().split('T')[0];
            const initialAttendance = { [today]: {} };
            setRehearsalDates([today]);
            setAttendance(initialAttendance);
            localStorage.setItem('choir_attendance', JSON.stringify(initialAttendance));
        } else {
            setRehearsalDates(dates);
            setAttendance(storedAttendance);
        }
    }, []);

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    const handleAddWeek = () => {
        if (!newDate) return;

        if (rehearsalDates.includes(newDate)) {
            showMessage('This date already exists', 'error');
            return;
        }

        const updatedDates = [newDate, ...rehearsalDates].sort((a, b) => new Date(b) - new Date(a));
        setRehearsalDates(updatedDates);
        setAttendance({
            ...attendance,
            [newDate]: {}
        });
        setIsAddModalOpen(false);
        showMessage('New rehearsal date added');
    };

    const toggleAttendance = (date, memberId) => {
        const currentDayAttendance = { ...(attendance[date] || {}) };
        currentDayAttendance[memberId] = !currentDayAttendance[memberId];

        setAttendance({
            ...attendance,
            [date]: currentDayAttendance
        });
    };

    const markAllForDate = (date, status) => {
        const newDayAttendance = {};
        if (status) {
            members.forEach(m => {
                newDayAttendance[m.id] = true;
            });
        }
        setAttendance({
            ...attendance,
            [date]: newDayAttendance
        });
    };

    const handleSave = () => {
        localStorage.setItem('choir_attendance', JSON.stringify(attendance));
        showMessage('Attendance data saved successfully');
    };

    const removeWeek = (date) => {
        if (window.confirm(`Are you sure you want to remove all attendance data for ${formatDate(date)}?`)) {
            const updatedDates = rehearsalDates.filter(d => d !== date);
            const updatedAttendance = { ...attendance };
            delete updatedAttendance[date];

            setRehearsalDates(updatedDates);
            setAttendance(updatedAttendance);
            localStorage.setItem('choir_attendance', JSON.stringify(updatedAttendance));
            showMessage('Week deleted');
        }
    };

    const formatDate = (dateStr) => {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString(undefined, options);
    };

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div>
                        <button
                            onClick={() => navigate('/admin')}
                            className="btn-text"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                color: 'var(--accent)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 0,
                                marginBottom: '0.5rem',
                                fontSize: '0.9rem'
                            }}
                        >
                            <ArrowLeft size={16} /> Admin Dashboard
                        </button>
                        <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Attendance Log</h1>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Track who's participating in each weekly rehearsal.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button onClick={() => setIsAddModalOpen(true)} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Plus size={18} /> Add Date
                        </button>
                        <button onClick={handleSave} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Save size={18} /> Save Data
                        </button>
                    </div>
                </div>

                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        style={{
                            padding: '1rem',
                            borderRadius: '12px',
                            marginBottom: '2rem',
                            background: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                            border: `1px solid ${message.type === 'error' ? '#ef4444' : '#10b981'}`,
                            color: message.type === 'error' ? '#ef4444' : '#10b981',
                            fontWeight: '500'
                        }}
                    >
                        {message.text}
                    </motion.div>
                )}

                <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                            <thead>
                                <tr style={{ background: 'rgba(0,0,0,0.02)' }}>
                                    <th style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--glass-border)', color: 'var(--secondary)', minWidth: '220px' }}>Member</th>
                                    {rehearsalDates.map(date => (
                                        <th key={date} style={{
                                            padding: '1.25rem 1rem',
                                            borderBottom: '1px solid var(--glass-border)',
                                            color: 'var(--secondary)',
                                            textAlign: 'center',
                                            minWidth: '130px',
                                            position: 'relative'
                                        }}>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{formatDate(date)}</div>
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                                <button
                                                    onClick={() => markAllForDate(date, true)}
                                                    style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.1)', border: 'none', color: '#10b981', padding: '0.1rem 0.3rem', borderRadius: '4px', cursor: 'pointer' }}
                                                >All</button>
                                                <button
                                                    onClick={() => markAllForDate(date, false)}
                                                    style={{ fontSize: '0.65rem', background: 'rgba(107, 114, 128, 0.1)', border: 'none', color: '#6b7280', padding: '0.1rem 0.3rem', borderRadius: '4px', cursor: 'pointer' }}
                                                >None</button>
                                                <button
                                                    onClick={() => removeWeek(date)}
                                                    style={{ color: '#ef4444', background: 'none', border: 'none', padding: '0.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {members.sort((a, b) => (a.name || '').localeCompare(b.name || '')).map(member => (
                                    <tr key={member.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ fontWeight: '600', color: 'var(--secondary)' }}>{member.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.email}</div>
                                        </td>
                                        {rehearsalDates.map(date => (
                                            <td key={date} style={{ padding: '1rem', textAlign: 'center' }}>
                                                <motion.div
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => toggleAttendance(date, member.id)}
                                                    style={{
                                                        width: '28px',
                                                        height: '28px',
                                                        borderRadius: '8px',
                                                        border: '2px solid',
                                                        borderColor: attendance[date]?.[member.id] ? 'var(--accent)' : 'rgba(0,0,0,0.1)',
                                                        background: attendance[date]?.[member.id] ? 'var(--accent)' : 'white',
                                                        margin: '0 auto',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        boxShadow: attendance[date]?.[member.id] ? '0 4px 12px rgba(var(--accent-rgb), 0.2)' : 'none',
                                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                                                    }}
                                                >
                                                    {attendance[date]?.[member.id] && <Check size={18} color="white" strokeWidth={3} />}
                                                </motion.div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {members.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem', marginTop: '2rem', background: 'rgba(0,0,0,0.02)', borderRadius: '16px', border: '2px dashed rgba(0,0,0,0.05)' }}>
                        <Users size={48} style={{ marginBottom: '1rem', color: 'var(--text-muted)', opacity: 0.5 }} />
                        <h3>No members found</h3>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0.5rem auto 1.5rem' }}>You need to add choir members in the dashboard before you can start tracking their attendance.</p>
                        <button onClick={() => navigate('/admin')} className="btn-primary">Go to Dashboard</button>
                    </div>
                )}
            </motion.div>

            {/* Add Date Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '1rem'
                    }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-card"
                            style={{ padding: '2.5rem', maxWidth: '450px', width: '100%' }}
                        >
                            <h2 style={{ marginBottom: '0.5rem' }}>Add Rehearsal Date</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Choose a new date to add to the attendance sheet.</p>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Select Date</label>
                                <input
                                    type="date"
                                    value={newDate}
                                    onChange={(e) => setNewDate(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem 1rem',
                                        borderRadius: '8px',
                                        border: '1px solid var(--glass-border)',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="btn-outline"
                                    style={{ flex: 1 }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddWeek}
                                    className="btn-primary"
                                    style={{ flex: 1 }}
                                >
                                    Add Date
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Attendance;

