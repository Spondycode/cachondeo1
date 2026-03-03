import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Music, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar" style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--glass-border)',
            padding: '1rem 0'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Music color="var(--secondary)" size={32} />
                    <span style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        fontFamily: "'Playfair Display', serif",
                        color: 'var(--secondary)'
                    }}>
                        Cachondeo
                    </span>
                </Link>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', color: 'var(--text-main)' }}>
                    {/* <Link to="/" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Home</Link> */}
                    {user && (
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                            <Link to="/members" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem' }}>Members</Link>
                            {user.isAdmin && (
                                <Link to="/admin" style={{ color: 'var(--secondary)', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>Admin</Link>
                            )}
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid var(--glass-border)' }}>
                                <Link to="/profile" style={{
                                    fontSize: '0.8rem',
                                    color: 'var(--text-muted)',
                                    textDecoration: 'none',
                                    transition: 'color 0.3s ease'
                                }}
                                    onMouseEnter={(e) => e.target.style.color = 'var(--secondary)'}
                                    onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                                >
                                    {user.name}
                                </Link>
                                <button onClick={handleLogout} className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Logout</button>
                            </div>
                        </div>
                    )}
                    {!user && (
                        <Link to="/login" className="btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <LogIn size={18} />
                            Member Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
