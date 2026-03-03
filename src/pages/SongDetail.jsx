import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Music, FileText, ArrowLeft, Download, Info, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

const SongDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [song, setSong] = useState(null);

    useEffect(() => {
        const songs = JSON.parse(localStorage.getItem('choir_songs') || '[]');
        const foundSong = songs.find(s => s.id === parseInt(id));
        if (foundSong) {
            setSong(foundSong);
        } else {
            navigate('/members');
        }
    }, [id, navigate]);

    if (!song) return <div className="container" style={{ padding: '2rem 2rem' }}>Loading...</div>;

    const practiceTracks = [
        { label: 'Soprano', url: song.sopranoAudio },
        { label: 'Alto', url: song.altoAudio },
        { label: 'Tenor', url: song.tenorAudio },
        { label: 'Bass', url: song.bassAudio },
    ].filter(track => track.url);

    return (
        <div className="container" style={{ padding: '2rem 2rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ maxWidth: '900px', margin: '0 auto' }}
            >
                <Link
                    to="/members"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--primary)',
                        textDecoration: 'none',
                        marginBottom: '2rem',
                        fontWeight: '500'
                    }}
                >
                    <ArrowLeft size={20} /> Back to Repertoire
                </Link>

                <div className="glass-card" style={{ padding: '3rem' }}>
                    <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem' }}>
                        <h1 style={{ color: 'var(--secondary)', fontSize: '2.5rem', marginBottom: '0.5rem' }}>{song.title}</h1>
                        <p style={{ color: 'var(--accent)', fontSize: '1.2rem', fontWeight: '500' }}>{song.composer}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                        {/* Info Section */}
                        <div>
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)', marginBottom: '1rem' }}>
                                    <Info size={20} /> Choir Leader Notes
                                </h3>
                                <div style={{
                                    background: 'rgba(255, 255, 255, 0.5)',
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    borderLeft: '4px solid var(--accent)',
                                    lineHeight: '1.6',
                                    color: 'var(--text-main)'
                                }}>
                                    {song.description || "No specific notes for this song yet."}
                                </div>
                            </div>
                        </div>

                        {/* Resources Section */}
                        <div>
                            <h3 style={{ color: 'var(--secondary)', marginBottom: '1.5rem' }}>Download Resources</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {/* PDF */}
                                {song.pdf && (
                                    <a href={song.pdf} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                                            <FileText size={20} color="#ff4d4d" /> Sheet Music (PDF)
                                        </span>
                                        <Download size={18} />
                                    </a>
                                )}

                                {/* Full Mix */}
                                {song.audio && (
                                    <a href={song.audio} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                                            <Headphones size={20} /> Full Mix (Audio)
                                        </span>
                                        <Download size={18} />
                                    </a>
                                )}

                                {/* Practice Tracks */}
                                {practiceTracks.length > 0 && (
                                    <div style={{ marginTop: '1rem' }}>
                                        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            Practice Tracks by Part
                                        </h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                                            {practiceTracks.map(track => (
                                                <a
                                                    key={track.label}
                                                    href={track.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn-outline"
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '0.5rem',
                                                        fontSize: '0.85rem',
                                                        padding: '0.6rem'
                                                    }}
                                                >
                                                    <Music size={16} /> {track.label}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SongDetail;
