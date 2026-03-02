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
        <div className="container" style={{ padding: '6rem 0' }}>
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

                        <div style={{ flex: 2 }}>
                            {/* Part Tracks (Moved outside the link to ensure they work) */}
                            {(song.sopranoAudio || song.altoAudio || song.tenorAudio || song.bassAudio) && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: '100%', marginBottom: '0.2rem' }}>Practice Tracks:</span>
                                    {song.sopranoAudio && (
                                        <a href={song.sopranoAudio} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem' }}>Soprano</a>
                                    )}
                                    {song.altoAudio && (
                                        <a href={song.altoAudio} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem' }}>Alto</a>
                                    )}
                                    {song.tenorAudio && (
                                        <a href={song.tenorAudio} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem' }}>Tenor</a>
                                    )}
                                    {song.bassAudio && (
                                        <a href={song.bassAudio} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem' }}>Bass</a>
                                    )}
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginLeft: '2rem' }}>
                            {song.pdf && (
                                <a href={song.pdf} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.8rem' }} title="View PDF">
                                    <FileText size={16} />
                                    PDF
                                </a>
                            )}
                            {song.audio && (
                                <a href={song.audio} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.8rem' }} title="Main Audio">
                                    <Music size={16} />
                                    Full Mix
                                </a>
                            )}
                            <button className="btn-outline" style={{ padding: '0.6rem 0.8rem' }} title="Download">
                                <Download size={16} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Members;
