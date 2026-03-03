import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Check, X, Save, ArrowLeft, Users, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const AttendanceEdit = () => {
    const { date } = useParams();
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);
    const [attendance, setAttendance] = useState({}); // { [memberId]: boolean }
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        // Load members
        const storedMembers = JSON.parse(localStorage.getItem('choir_members') || '[]');
        setMembers(storedMembers.sort((a, b) => (a.name || '').localeCompare(b.name || '')));

        // Load attendance for this specifically date
        const allAttendance = JSON.parse(localStorage.getItem('choir_attendance') || '{}');
        setAttendance(allAttendance[date] || {});
    }, [date]);

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    const toggleAttendance = (memberId) => {
        setAttendance(prev => ({
            ...prev,
            [memberId]: !prev[memberId]
        }));
    };

    const handleSave = () => {
        const allAttendance = JSON.parse(localStorage.getItem('choir_attendance') || '{}');
        allAttendance[date] = attendance;
        localStorage.setItem('choir_attendance', JSON.stringify(allAttendance));
        showMessage('Attendance saved successfully');

        // Return to log after short delay
        setTimeout(() => navigate('/admin/attendance'), 1000);
    };

    const formatDate = (dateStr) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        try {
            return new Date(dateStr).toLocaleDateString(undefined, options);
        } catch (e) {
            return dateStr;
        }
    };

    const stats = {
        total: members.length,
        attended: Object.values(attendance).filter(Boolean).length
    };

    return (
        <div className="container" style={{ padding: '4rem 2rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                    <div>
                        <button
                            onClick={() => navigate('/admin/attendance')}
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
                            <ArrowLeft size={16} /> Back to Attendance Log
                        </button>
                        <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Mark Attendance</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                            <Calendar size={18} />
                            <span style={{ fontWeight: '600' }}>{formatDate(date)}</span>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '1rem 1.5rem', display: 'flex', gap: '2rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>{stats.attended}</div>
                            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Present</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--secondary)' }}>{stats.total}</div>
                            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Total Members</div>
                        </div>
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

                <div className="glass-card" style={{ padding: '0.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                        {members.map(member => (
                            <motion.div
                                key={member.id}
                                whileHover={{ scale: 1.01 }}
                                onClick={() => toggleAttendance(member.id)}
                                style={{
                                    padding: '1.25rem',
                                    borderRadius: '12px',
                                    background: attendance[member.id] ? 'var(--accent-light)' : 'rgba(255,255,255,0.5)',
                                    border: '1px solid',
                                    borderColor: attendance[member.id] ? 'var(--accent)' : 'var(--glass-border)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: '600', color: attendance[member.id] ? 'var(--accent)' : 'var(--secondary)' }}>{member.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.email}</div>
                                </div>
                                <div style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '8px',
                                    border: '2px solid',
                                    borderColor: attendance[member.id] ? 'var(--accent)' : 'rgba(0,0,0,0.1)',
                                    background: attendance[member.id] ? 'var(--accent)' : 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease'
                                }}>
                                    {attendance[member.id] && <Check size={18} color="white" strokeWidth={3} />}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center' }}>
                    <button
                        onClick={handleSave}
                        className="btn-primary"
                        style={{
                            padding: '1rem 3rem',
                            fontSize: '1.1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            boxShadow: '0 10px 25px rgba(var(--accent-rgb), 0.3)'
                        }}
                    >
                        <Save size={20} /> Save Attendance Records
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AttendanceEdit;
