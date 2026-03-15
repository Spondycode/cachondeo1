import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Search, AlertCircle, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import {
    collection,
    query,
    orderBy,
    where,
    getDocs,
    Timestamp,
    onSnapshot
} from 'firebase/firestore';

const LoginLogs = () => {
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Calculate date 30 days ago
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        // Query login logs for the last 30 days
        const logsQuery = query(
            collection(db, 'loginLogs'),
            where('timestamp', '>=', Timestamp.fromDate(thirtyDaysAgo)),
            orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(logsQuery, (snapshot) => {
            const logsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate() || new Date()
            }));
            setLogs(logsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching login logs:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const formatDate = (date) => {
        return date.toLocaleString(undefined, { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const filteredLogs = logs.filter(log => 
        log.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2rem' }}>
                    <button
                        onClick={() => navigate('/profile')}
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
                            fontSize: '0.9rem'
                        }}
                    >
                        <ArrowLeft size={16} /> Back to Profile
                    </button>
                </div>

                <div className="mobile-stack" style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', gap: '1.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', margin: 0, lineHeight: 1.2 }}>Login Logs</h1>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>View the login history for the past 30 days.</p>
                    </div>
                    
                    <div style={{ position: 'relative', minWidth: '300px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search by email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.8rem 1rem 0.8rem 2.8rem',
                                borderRadius: '8px',
                                border: '1px solid var(--glass-border)',
                                background: 'white'
                            }}
                        />
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '2rem', overflowX: 'auto' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                            <div className="spinner"></div>
                            <p style={{ marginTop: '1rem' }}>Loading logs...</p>
                        </div>
                    ) : filteredLogs.length > 0 ? (
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--glass-border)', textAlign: 'left' }}>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>User</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {filteredLogs.map(log => (
                                        <motion.tr 
                                            key={log.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            style={{ borderBottom: '1px solid var(--glass-border)' }}
                                        >
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontWeight: '500' }}>{log.email}</div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                    <Clock size={14} />
                                                    {formatDate(log.timestamp)}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
                            <AlertCircle size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                            <h3>No Login Logs Found</h3>
                            <p>No recent login activity matches your criteria.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default LoginLogs;
