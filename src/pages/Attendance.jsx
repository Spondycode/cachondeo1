import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Save, Plus, ArrowLeft, Calendar, Users, Trash2, ChevronRight, Edit2 } from 'lucide-react';
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
        const storedMembers = JSON.parse(localStorage.getItem('choir_members') || '[]');
        setMembers(storedMembers);

        // Load attendance data
        const storedAttendance = JSON.parse(localStorage.getItem('choir_attendance') || '{}');
        const dates = Object.keys(storedAttendance).sort((a, b) => new Date(b) - new Date(a));

        if (dates.length > 0) {
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
        const updatedAttendance = { ...attendance, [newDate]: {} };

        setRehearsalDates(updatedDates);
        setAttendance(updatedAttendance);
        localStorage.setItem('choir_attendance', JSON.stringify(updatedAttendance));

        setIsAddModalOpen(false);
        showMessage('New rehearsal date added');

        // Navigate to edit for the new date
        navigate(`/admin/attendance/${newDate}`);
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
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(dateStr).toLocaleDateString(undefined, options);
    };

    const getAttendees = (date) => {
        const dayAttendance = attendance[date] || {};
        return members.filter(m => dayAttendance[m.id]);
    };

    return (
        <div className="container" style={{ padding: '4rem 2rem' }}>
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
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>View and manage historical rehearsal attendance.</p>
                    </div>
                    <div>
                        <button onClick={() => setIsAddModalOpen(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Plus size={18} /> New Rehearsal
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

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {rehearsalDates.length > 0 ? (
                        rehearsalDates.map(date => {
                            const attendees = getAttendees(date);
                            return (
                                <motion.div
                                    key={date}
                                    whileHover={{ y: -4 }}
                                    className="glass-card"
                                    style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                            <Calendar size={20} color="var(--accent)" />
                                            <h3 style={{ margin: 0 }}>{formatDate(date)}</h3>
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                                            {attendees.length > 0 ? (
                                                attendees.map(m => (
                                                    <span key={m.id} style={{
                                                        fontSize: '0.75rem',
                                                        padding: '0.2rem 0.6rem',
                                                        background: 'var(--accent-light)',
                                                        color: 'var(--accent)',
                                                        borderRadius: '20px',
                                                        fontWeight: '500'
                                                    }}>
                                                        {m.name || m.email}
                                                    </span>
                                                ))
                                            ) : (
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No attendees recorded yet.</span>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', marginLeft: '2rem' }}>
                                        <button
                                            onClick={() => navigate(`/admin/attendance/${date}`)}
                                            className="btn-outline"
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem' }}
                                        >
                                            <Edit2 size={16} /> Edit
                                        </button>
                                        <button
                                            onClick={() => removeWeek(date)}
                                            style={{
                                                color: '#ef4444',
                                                background: 'rgba(239, 68, 68, 0.05)',
                                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                                padding: '0.6rem',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'rgba(0,0,0,0.02)', borderRadius: '24px', border: '2px dashed rgba(0,0,0,0.05)' }}>
                            <Calendar size={64} style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', opacity: 0.3 }} />
                            <h2>No Rehearsals Logged</h2>
                            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0.5rem auto 2rem' }}>Start by adding your first rehearsal date to track attendance.</p>
                            <button onClick={() => setIsAddModalOpen(true)} className="btn-primary">Add First Rehearsal</button>
                        </div>
                    )}
                </div>
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
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Choose a date for the new rehearsal record.</p>

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
                                    Add & Continue
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

