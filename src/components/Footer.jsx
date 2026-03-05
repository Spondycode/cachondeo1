import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            background: 'var(--primary-light)',
            padding: '2rem 0',
            borderTop: '1px solid var(--glass-border)',
            width: '100%'
        }}>
            <div className="container">
                <div style={{
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)'
                }}>
                    &copy; {new Date().getFullYear()} Website by Spondycode David Allen.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
