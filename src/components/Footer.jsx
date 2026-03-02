import React from 'react';
import { Music } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{
            background: 'var(--primary-light)',
            padding: '4rem 0 2rem',
            borderTop: '1px solid var(--glass-border)',
            marginTop: '4rem'
        }}>
            <div className="container">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Music color="var(--secondary)" size={24} />
                        <span style={{
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            fontFamily: "'Playfair Display', serif",
                            color: 'var(--secondary)'
                        }}>
                            Cachondeo Choir
                        </span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', textAlign: 'center' }}>
                        Singing popular hits and spreading joy across the Costa Brava. Joining hearts, one note at a time.
                    </p>
                    <div style={{
                        marginTop: '2rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid var(--glass-border)',
                        width: '100%',
                        textAlign: 'center',
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)'
                    }}>
                        &copy; {new Date().getFullYear()} Cachondeo Choir. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
