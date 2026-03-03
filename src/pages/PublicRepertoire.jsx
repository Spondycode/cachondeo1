import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Music, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const PublicRepertoire = () => {
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        const storedSongs = JSON.parse(localStorage.getItem('choir_songs') || '[]');
        setSongs(storedSongs);
    }, []);

    return (
        <div className="public-repertoire-page" style={{ backgroundColor: '#f0f7ff', padding: '4rem 0' }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link to="/" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', padding: '0.5rem 1rem' }}>
                        <ArrowLeft size={18} /> Back to Home
                    </Link>

                    <div style={{ marginBottom: '3rem' }}>
                        <h1 style={{ fontSize: '3rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Our Current <span style={{ color: 'var(--secondary)' }}>Repertoire</span></h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px' }}>
                            Take a look at the popular hits and classics we are currently practicing and performing.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '800px' }}>
                        {songs.length > 0 ? (
                            songs.map((song, index) => (
                                <motion.div
                                    key={song.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass-card"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1.5rem',
                                        padding: '1.5rem 2rem',
                                        background: 'rgba(255, 255, 255, 0.7)',
                                        border: '1px solid rgba(0, 119, 190, 0.1)'
                                    }}
                                >
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        background: 'var(--secondary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white'
                                    }}>
                                        <Music size={24} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: 'var(--text-main)' }}>{song.title}</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>{song.composer}</p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>No songs found in our current repertoire.</p>
                        )}
                    </div>

                    {/* <div style={{ marginTop: '4rem', padding: '3rem', borderRadius: '24px', background: 'var(--primary)', color: 'white', textAlign: 'center' }}>
                        <h2 style={{ marginBottom: '1rem' }}>Want to sing with us?</h2>
                        <p style={{ marginBottom: '2rem', opacity: 0.9 }}>Join our vibrant community and bring these hits to life!</p>
                        <Link to="/login" className="btn-secondary">Member Login</Link>
                    </div> */}
                </motion.div>
            </div>
        </div>
    );
};

export default PublicRepertoire;
