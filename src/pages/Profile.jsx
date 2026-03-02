import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Save, X, ArrowLeft, Key, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, updateUserProfile } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        voicePart: user?.voicePart || 'Soprano',
        password: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState({ text: '', type: '' });

    const voiceParts = ['Soprano', 'Alto', 'Tenor', 'Bass'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password && formData.password !== formData.confirmPassword) {
            setMessage({ text: 'Passwords do not match', type: 'error' });
            return;
        }

        const updateData = {
            name: formData.name,
            voicePart: formData.voicePart
        };

        if (formData.password) {
            updateData.password = formData.password;
        }

        updateUserProfile(updateData);
        setMessage({ text: 'Profile updated successfully!', type: 'success' });

        setTimeout(() => {
            navigate('/members');
        }, 2000);
    };

    return (
        <div className="container" style={{ padding: '6rem 0', maxWidth: '600px' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '3rem' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 style={{ fontSize: '2.5rem', margin: 0, color: 'var(--secondary)' }}>MY PROFILE</h1>
                </div>
                <p style={{ color: 'var(--text-muted)' }}>Manage your personal information and preferences.</p>
                <div style={{ width: '80px', height: '2px', background: 'var(--accent)', marginTop: '1rem' }}></div>
            </motion.div>

            {message.text && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '2rem',
                        background: message.type === 'error' ? 'rgba(255, 68, 68, 0.1)' : 'rgba(0, 200, 81, 0.1)',
                        border: `1px solid ${message.type === 'error' ? '#ff4444' : '#00c851'}`,
                        color: message.type === 'error' ? '#ff4444' : '#00c851',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    {message.type === 'success' ? <Save size={18} /> : <X size={18} />}
                    {message.text}
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Name */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
                            Full Name
                        </label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1rem 0.8rem 2.8rem',
                                    borderRadius: '8px',
                                    border: '1px solid var(--glass-border)',
                                    background: 'rgba(255, 255, 255, 0.5)'
                                }}
                            />
                        </div>
                    </div>

                    {/* Email (Read Only) */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', opacity: 0.7 }}>
                            Email Address (Contact admin to change)
                        </label>
                        <input
                            type="email"
                            value={user?.email}
                            disabled
                            style={{
                                width: '100%',
                                padding: '0.8rem 1rem',
                                borderRadius: '8px',
                                border: '1px solid var(--glass-border)',
                                background: 'rgba(0, 0, 0, 0.05)',
                                cursor: 'not-allowed',
                                color: 'var(--text-muted)'
                            }}
                        />
                    </div>

                    {/* Voice Part */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
                            Voice Part
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Music size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <select
                                name="voicePart"
                                value={formData.voicePart}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1rem 0.8rem 2.8rem',
                                    borderRadius: '8px',
                                    border: '1px solid var(--glass-border)',
                                    background: 'rgba(255, 255, 255, 0.5)',
                                    appearance: 'none'
                                }}
                            >
                                {voiceParts.map(part => (
                                    <option key={part} value={part}>{part}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ height: '1px', background: 'var(--glass-border)', margin: '1rem 0' }}></div>

                    {/* Password Change */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Key size={18} color="var(--secondary)" />
                        <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Change Password</h3>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        Leave blank if you don't want to change your password.
                    </p>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
                            New Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '0.8rem 1rem',
                                borderRadius: '8px',
                                border: '1px solid var(--glass-border)',
                                background: 'rgba(255, 255, 255, 0.5)'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '0.8rem 1rem',
                                borderRadius: '8px',
                                border: '1px solid var(--glass-border)',
                                background: 'rgba(255, 255, 255, 0.5)'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="btn-outline"
                            style={{ flex: 1, padding: '1rem' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ flex: 2, padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        >
                            <Save size={20} />
                            Save Profile
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Profile;
