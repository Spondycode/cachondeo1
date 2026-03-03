import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Music, LogIn, LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/');
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setIsMenuOpen(false)}>
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

                {/* Mobile Toggle Button */}
                <button className="mobile-toggle" onClick={toggleMenu} aria-label="Toggle menu">
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                <div className={`nav-menu ${isMenuOpen ? 'is-open' : ''}`}>
                    {user && (
                        <div className="nav-menu-items">
                            <Link
                                to="/members"
                                onClick={() => setIsMenuOpen(false)}
                                style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem' }}
                            >
                                Songs
                            </Link>
                            {user.isAdmin && (
                                <Link
                                    to="/admin"
                                    onClick={() => setIsMenuOpen(false)}
                                    style={{ color: 'var(--secondary)', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}
                                >
                                    Admin
                                </Link>
                            )}
                            <div className="nav-auth" style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid var(--glass-border)' }}>
                                <Link to="/profile"
                                    onClick={() => setIsMenuOpen(false)}
                                    style={{
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
                                <button onClick={handleLogout} className="btn-outline" style={{ padding: '0.5rem 0.5rem', fontSize: '0.8rem' }}>Logout</button>
                            </div>
                        </div>
                    )}
                    {!user && (
                        <Link to="/login" className="btn-primary" onClick={() => setIsMenuOpen(false)} style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
