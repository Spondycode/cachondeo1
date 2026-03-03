import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, X, Music, FileText, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const EditSong = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [song, setSong] = useState(null);

    useEffect(() => {
        const fetchSong = async () => {
            try {
                const songDoc = await getDoc(doc(db, 'songs', id));
                if (songDoc.exists()) {
                    setSong({
                        title: '',
                        composer: '',
                        pdf: '',
                        audio: '',
                        sopranoAudio: '',
                        altoAudio: '',
                        tenorAudio: '',
                        bassAudio: '',
                        description: '',
                        ...songDoc.data()
                    });
                } else {
                    navigate('/admin');
                }
            } catch (error) {
                console.error("Error fetching song:", error);
                navigate('/admin');
            }
        };
        fetchSong();
    }, [id, navigate]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await updateDoc(doc(db, 'songs', id), song);
            navigate('/admin');
        } catch (error) {
            console.error("Error updating song:", error);
            alert('Failed to update song');
        }
    };

    if (!song) return <div className="container" style={{ padding: '6rem 0' }}>Loading...</div>;

    return (
        <div className="container" style={{ padding: '6rem 0' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ maxWidth: '800px', margin: '0 auto' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ color: 'var(--secondary)', margin: 0 }}>Edit Song</h1>
                    <button onClick={() => navigate('/admin')} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <X size={20} /> Cancel
                    </button>
                </div>

                <div className="glass-card" style={{ padding: '2rem' }}>
                    <form onSubmit={handleSave} style={{ display: 'grid', gap: '2rem' }}>
                        {/* Basic Info */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Song Title</label>
                                <input
                                    type="text"
                                    value={song.title}
                                    onChange={e => setSong({ ...song, title: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Composer/Artist</label>
                                <input
                                    type="text"
                                    value={song.composer}
                                    onChange={e => setSong({ ...song, composer: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }}
                                />
                            </div>
                        </div>

                        {/* PDF & Main Audio */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>
                                    <FileText size={16} style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} />
                                    PDF URL (Sheet Music)
                                </label>
                                <input
                                    type="text"
                                    value={song.pdf}
                                    onChange={e => setSong({ ...song, pdf: e.target.value })}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>
                                    <Music size={16} style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} />
                                    Main Audio URL (All Parts)
                                </label>
                                <input
                                    type="text"
                                    value={song.audio}
                                    onChange={e => setSong({ ...song, audio: e.target.value })}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }}
                                />
                            </div>
                        </div>

                        {/* Part-specific Audio */}
                        <div>
                            <h3 style={{ fontSize: '1.1rem', color: 'var(--secondary)', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                                Practice Tracks by Part
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>Soprano Track</label>
                                    <input
                                        type="text"
                                        placeholder="URL for Sopranos"
                                        value={song.sopranoAudio}
                                        onChange={e => setSong({ ...song, sopranoAudio: e.target.value })}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>Alto Track</label>
                                    <input
                                        type="text"
                                        placeholder="URL for Altos"
                                        value={song.altoAudio}
                                        onChange={e => setSong({ ...song, altoAudio: e.target.value })}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>Tenor Track</label>
                                    <input
                                        type="text"
                                        placeholder="URL for Tenors"
                                        value={song.tenorAudio}
                                        onChange={e => setSong({ ...song, tenorAudio: e.target.value })}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>Bass Track</label>
                                    <input
                                        type="text"
                                        placeholder="URL for Basses"
                                        value={song.bassAudio}
                                        onChange={e => setSong({ ...song, bassAudio: e.target.value })}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>
                                <Info size={16} style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} />
                                Choir Leader Notes/Description
                            </label>
                            <textarea
                                value={song.description}
                                onChange={e => setSong({ ...song, description: e.target.value })}
                                placeholder="Add tips, instructions, or context for the choir members..."
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    borderRadius: '4px',
                                    border: '1px solid var(--glass-border)',
                                    minHeight: '150px',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        <button type="submit" className="btn-primary" style={{ padding: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                            <Save size={20} /> Save Changes
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default EditSong;
