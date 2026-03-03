import React from 'react';
import { FileText, Music, Download, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Members = () => {
    const [songs, setSongs] = React.useState([]);

    React.useEffect(() => {
        const storedSongs = JSON.parse(localStorage.getItem('choir_songs') || '[]');
        setSongs(storedSongs);
    }, []);

    return (
        <div className="container" style={{ padding: '6rem 2rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '4rem' }}
            >
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--secondary)' }}>MEMBER PORTAL</h1>
                <p style={{ color: 'var(--text-muted)' }}>Access our current popular repertoire, practice tracks, and sheet music.</p>
                <div style={{ width: '100px', height: '2px', background: 'var(--accent)', marginTop: '1.5rem' }}></div>
            </motion.div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {songs.map((song, index) => (
                    <motion.div
                        key={song.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card"
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1.5rem 2rem'
                        }}
                    >
                        <Link to={`/members/song/${song.id}`} style={{ flex: 1, textDecoration: 'none', display: 'block' }}>
                            <div style={{ cursor: 'pointer' }}>
                                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.2rem', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {song.title} <ChevronRight size={18} style={{ opacity: 0.5 }} />
                                </h3>
                                <p style={{ color: 'var(--accent)', fontSize: '0.9rem', marginBottom: '0.8rem', fontWeight: '500' }}>{song.composer}</p>

                                {song.description && (
                                    <div style={{
                                        background: 'rgba(52, 152, 219, 0.05)',
                                        padding: '0.8rem',
                                        borderRadius: '4px',
                                        fontSize: '0.85rem',
                                        color: 'var(--text-muted)',
                                        marginBottom: '1rem',
                                        borderLeft: '3px solid var(--accent)',
                                        lineHeight: '1.4'
                                    }}>
                                        {song.description.length > 150 ? `${song.description.substring(0, 150)}...` : song.description}
                                    </div>
                                )}
                            </div>
                        </Link>

                        <div style={{ flex: 1, display: song.description || (song.sopranoAudio || song.altoAudio || song.tenorAudio || song.bassAudio) ? 'none' : 'block' }}>
                            {/* Empty space if no description and no parts, to maintain layout if needed, 
                                but actually we want the link to take precedence. 
                                The logic above wrapped the whole info area. */}
                        </div>

                        <div style={{ flexBasis: '100%', display: 'none' }}></div> {/* Spacer for wrap if needed */}

                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Members;
