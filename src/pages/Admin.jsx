import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Music, Plus, Trash2, Save, FileText, Link as LinkIcon, X, Edit2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    onSnapshot,
    query,
    orderBy
} from 'firebase/firestore';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('members');
    const [members, setMembers] = useState([]);
    const [songs, setSongs] = useState([]);
    const navigate = useNavigate();

    // Form states
    const [newMember, setNewMember] = useState({ name: '', email: '', phone: '', password: '', voicePart: 'Soprano' });
    const [newSong, setNewSong] = useState({ title: '', composer: '', pdf: '', audio: '', description: '' });
    const [editingMember, setEditingMember] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        // Real-time listener for members
        const membersQuery = query(collection(db, 'members'), orderBy('name'));
        const unsubscribeMembers = onSnapshot(membersQuery, (snapshot) => {
            const membersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.id && doc.data()
            }));
            setMembers(membersData);
        });

        // Real-time listener for songs
        const songsQuery = query(collection(db, 'songs'), orderBy('title'));
        const unsubscribeSongs = onSnapshot(songsQuery, (snapshot) => {
            const songsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSongs(songsData);
        });

        return () => {
            unsubscribeMembers();
            unsubscribeSongs();
        };
    }, []);

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        if (members.find(m => m.email === newMember.email)) {
            showMessage('Member already exists', 'error');
            return;
        }
        try {
            await addDoc(collection(db, 'members'), newMember);
            setNewMember({ name: '', email: '', phone: '', password: '', voicePart: 'Soprano' });
            showMessage('Member added successfully');
        } catch (error) {
            console.error("Error adding member:", error);
            showMessage(`Failed to add member: ${error.message || 'Unknown error'}`, 'error');
        }
    };

    const handleAddSong = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'songs'), newSong);
            setNewSong({ title: '', composer: '', pdf: '', audio: '', description: '' });
            showMessage('Song added successfully');
        } catch (error) {
            console.error("Error adding song:", error);
            showMessage(`Failed to add song: ${error.message || 'Unknown error'}`, 'error');
        }
    };

    const removeMember = async (id) => {
        try {
            await deleteDoc(doc(db, 'members', id));
            showMessage('Member removed');
        } catch (error) {
            console.error("Error removing member:", error);
            showMessage('Failed to remove member', 'error');
        }
    };

    const removeSong = async (id) => {
        try {
            await deleteDoc(doc(db, 'songs', id));
            showMessage('Song removed');
        } catch (error) {
            console.error("Error removing song:", error);
            showMessage('Failed to remove song', 'error');
        }
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        try {
            const { id, ...data } = editingMember;
            await updateDoc(doc(db, 'members', id), data);
            setEditingMember(null);
            showMessage('Member updated successfully');
        } catch (error) {
            console.error("Error updating member:", error);
            showMessage('Failed to update member', 'error');
        }
    };

    return (
        <div className="container" style={{ padding: '6rem 2rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '3rem' }}
            >
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--secondary)' }}>ADMIN DASHBOARD</h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage choir members and repertoire.</p>
                <div style={{ width: '100px', height: '2px', background: 'var(--accent)', marginTop: '1.5rem' }}></div>
            </motion.div>

            {message.text && (
                <div style={{
                    padding: '1rem',
                    borderRadius: '4px',
                    marginBottom: '2rem',
                    background: message.type === 'error' ? 'rgba(255,0,0,0.1)' : 'rgba(0,128,0,0.1)',
                    border: `1px solid ${message.type === 'error' ? 'red' : 'green'}`,
                    color: message.type === 'error' ? 'red' : 'green'
                }}>
                    {message.text}
                </div>
            )}

            <div className="admin-nav-buttons" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveTab('members')}
                    className={activeTab === 'members' ? 'btn-primary' : 'btn-outline'}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                    <Users size={20} /> Manage Members
                </button>
                <button
                    onClick={() => setActiveTab('songs')}
                    className={activeTab === 'songs' ? 'btn-primary' : 'btn-outline'}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                    <Music size={20} /> Manage Repertoire
                </button>
                <button
                    onClick={() => navigate('/admin/attendance')}
                    className="btn-outline"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                    <Calendar size={20} /> Register Attendance
                </button>
            </div>


            <div className="glass-card" style={{ padding: '2rem' }}>
                {activeTab === 'members' ? (
                    <div>
                        <h2 style={{ marginBottom: '1.5rem', color: 'var(--secondary)' }}>Add New Member</h2>
                        <form onSubmit={handleAddMember} className="admin-form" style={{ gap: '1rem', marginBottom: '2rem' }}>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={newMember.name}
                                onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                                required
                                style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }}
                            />
                            <select
                                value={newMember.voicePart}
                                onChange={e => setNewMember({ ...newMember, voicePart: e.target.value })}
                                style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--glass-border)', background: 'white' }}
                                required
                            >
                                <option value="Soprano">Soprano</option>
                                <option value="Alto">Alto</option>
                                <option value="Tenor">Tenor</option>
                                <option value="Bass">Bass</option>
                                <option value="Other">Other</option>
                            </select>
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={newMember.email}
                                onChange={e => setNewMember({ ...newMember, email: e.target.value })}
                                required
                                style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }}
                            />
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={newMember.phone}
                                onChange={e => setNewMember({ ...newMember, phone: e.target.value })}
                                style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }}
                            />
                            <input
                                type="text"
                                placeholder="Temporary Password"
                                value={newMember.password}
                                onChange={e => setNewMember({ ...newMember, password: e.target.value })}
                                required
                                style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }}
                            />
                            <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2', padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <Plus size={20} /> Add Member
                            </button>
                        </form>

                        <h2 style={{ marginBottom: '1.5rem', color: 'var(--secondary)' }}>Current Members</h2>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {members.length > 0 && (
                                <div className="member-grid-layout member-list-header" style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'minmax(150px, 1fr) minmax(200px, 1.5fr) minmax(130px, 1fr) 100px 80px',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '0 1rem',
                                    fontSize: '0.8rem',
                                    color: 'var(--text-muted)',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}>
                                    <div>Name</div>
                                    <div>Email</div>
                                    <div>Phone</div>
                                    <div style={{ textAlign: 'center' }}>Voice</div>
                                    <div style={{ textAlign: 'right' }}>Actions</div>
                                </div>
                            )}
                            {members
                                .sort((a, b) => {
                                    const voiceOrder = { 'Soprano': 1, 'Alto': 2, 'Tenor': 3, 'Bass': 4, 'Other': 5 };
                                    const orderA = voiceOrder[a.voicePart] || 6;
                                    const orderB = voiceOrder[b.voicePart] || 6;

                                    if (orderA !== orderB) return orderA - orderB;
                                    return (a.name || '').localeCompare(b.name || '');
                                })
                                .map(member => (
                                    <div key={member.id} className="admin-list-card" style={{ padding: '1rem', background: 'var(--white)', borderRadius: '4px', border: '1px solid var(--glass-border)' }}>
                                        <div className="member-grid-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 1fr) minmax(200px, 1.5fr) minmax(130px, 1fr) 100px 80px', alignItems: 'center', gap: '1rem', width: '100%' }}>
                                            <div style={{ fontWeight: '600', color: 'var(--secondary)' }}>{member.name || 'No Name'}</div>
                                            <div style={{ color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.email}</div>
                                            <div style={{ color: 'var(--text-muted)' }}>{member.phone || 'No Phone'}</div>
                                            <div style={{
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: '20px',
                                                fontSize: '0.8rem',
                                                background: 'var(--accent-light)',
                                                color: 'var(--secondary)',
                                                textAlign: 'center'
                                            }}>
                                                {member.voicePart || 'Unassigned'}
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button
                                                    onClick={() => setEditingMember(member)}
                                                    style={{ color: 'var(--secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
                                                    title="Edit Member"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => removeMember(member.id)}
                                                    style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
                                                    title="Remove Member"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            {members.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No members added yet.</p>}
                        </div>
                    </div>
                ) : (
                    <div>
                        <h2 style={{ marginBottom: '1.5rem', color: 'var(--secondary)' }}>Add New Song</h2>
                        <form onSubmit={handleAddSong} style={{ display: 'grid', gap: '1rem', marginBottom: '3rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <input
                                    type="text"
                                    placeholder="Song Title"
                                    value={newSong.title}
                                    onChange={e => setNewSong({ ...newSong, title: e.target.value })}
                                    required
                                    style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }}
                                />
                                <input
                                    type="text"
                                    placeholder="Composer/Artist"
                                    value={newSong.composer}
                                    onChange={e => setNewSong({ ...newSong, composer: e.target.value })}
                                    required
                                    style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <input
                                    type="text"
                                    placeholder="PDF URL"
                                    value={newSong.pdf}
                                    onChange={e => setNewSong({ ...newSong, pdf: e.target.value })}
                                    style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }}
                                />
                                <input
                                    type="text"
                                    placeholder="Audio URL"
                                    value={newSong.audio}
                                    onChange={e => setNewSong({ ...newSong, audio: e.target.value })}
                                    style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }}
                                />
                            </div>
                            <textarea
                                placeholder="Song description or choir leader notes..."
                                value={newSong.description}
                                onChange={e => setNewSong({ ...newSong, description: e.target.value })}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--glass-border)', minHeight: '100px', fontFamily: 'inherit' }}
                            />
                            <button type="submit" className="btn-primary" style={{ padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <Plus size={20} /> Add Song to Repertoire
                            </button>
                        </form>

                        <h2 style={{ marginBottom: '1.5rem', color: 'var(--secondary)' }}>Current Repertoire</h2>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {songs.map(song => (
                                <div key={song.id} className="admin-list-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--white)', borderRadius: '4px', border: '1px solid var(--glass-border)' }}>
                                    <div>
                                        <strong style={{ color: 'var(--secondary)' }}>{song.title}</strong>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{song.composer}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => navigate(`/admin/edit-song/${song.id}`)}
                                            style={{ color: 'var(--secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
                                            title="Edit Song"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => removeSong(song.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Member Modal */}
            {editingMember && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(4px)'
                }}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="glass-card"
                        style={{ padding: '2rem', width: '90%', maxWidth: '500px', background: 'white' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ color: 'var(--secondary)', margin: 0 }}>Edit Member</h2>
                            <button onClick={() => setEditingMember(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSaveEdit} style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>Full Name</label>
                                <input
                                    type="text"
                                    value={editingMember.name}
                                    onChange={e => setEditingMember({ ...editingMember, name: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>Email Address</label>
                                <input
                                    type="email"
                                    value={editingMember.email}
                                    onChange={e => setEditingMember({ ...editingMember, email: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>Phone Number</label>
                                <input
                                    type="tel"
                                    value={editingMember.phone || ''}
                                    onChange={e => setEditingMember({ ...editingMember, phone: e.target.value })}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>Password</label>
                                <input
                                    type="text"
                                    value={editingMember.password}
                                    onChange={e => setEditingMember({ ...editingMember, password: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>Voice Part</label>
                                <select
                                    value={editingMember.voicePart}
                                    onChange={e => setEditingMember({ ...editingMember, voicePart: e.target.value })}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--glass-border)', background: 'white' }}
                                    required
                                >
                                    <option value="Soprano">Soprano</option>
                                    <option value="Alto">Alto</option>
                                    <option value="Tenor">Tenor</option>
                                    <option value="Bass">Bass</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setEditingMember(null)} className="btn-outline" style={{ flex: 1 }}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Admin;
