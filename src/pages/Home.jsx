import React from 'react';
import { Link } from 'react-router-dom';
import { Music, MapPin, Users, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user } = useAuth();
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero" style={{
                backgroundColor: '#ffffff',
                overflow: 'hidden'
            }}>
                {/* Costa Brava Hero Image */}
                <div style={{
                    width: '100%',
                    height: '50vh',
                    backgroundImage: 'url("/costa_brava_hero.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderBottom: '4px solid var(--secondary)'
                }}></div>

                <div className="container" style={{ padding: '4rem 0' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}
                    >
                        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: '1.1' }}>

                            <span style={{ color: 'var(--secondary)' }}>Singing For Fun</span>
                        </h1>
                        <p style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '2.5rem', fontWeight: '500', lineHeight: '1.6' }}>
                            Welcome to Cachondeo Choir. We are a high-energy community on the Costa Brava, bringing popular hits to life with sun, sea, and song.
                        </p>
                        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                            <Link to="/repertoire" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                Explore Repertoire <ArrowRight size={18} />
                            </Link>
                            <button className="btn-outline">Watch Our Story</button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: '8rem 0', background: 'var(--primary)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Our Vibrant Community</h2>
                        <div style={{ width: '60px', height: '3px', background: 'var(--accent)', margin: '0 auto' }}></div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="glass-card"
                            style={{ textAlign: 'center' }}
                        >
                            <Users color="#d4af37" size={40} style={{ marginBottom: '1.5rem' }} />
                            <h3 style={{ marginBottom: '1rem' }}>Vibrant Community</h3>
                            <p style={{ color: '#8892b0', fontSize: '0.9rem' }}>
                                Join over 50 passionate singers from all walks of life.
                            </p>
                        </motion.div>

                        <Link to={user ? "/rehearsal" : "/login"} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <motion.div
                                whileHover={{ y: -10 }}
                                className="glass-card"
                                style={{ textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', cursor: 'pointer' }}
                            >
                                <Calendar color="var(--secondary)" size={40} style={{ marginBottom: '1.5rem' }} />
                                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    Weekly Fun {user && <ArrowRight size={18} color="var(--accent)" />}
                                </h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    Every Thursday at 7:00 PM at the Costa Brava Community Arts Center.
                                </p>
                                {user && <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: '600', marginTop: '1rem', display: 'block' }}>VIEW DETAILS</span>}
                            </motion.div>
                        </Link>

                        <motion.div
                            whileHover={{ y: -10 }}
                            className="glass-card"
                            style={{ textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                        >
                            <MapPin color="var(--secondary)" size={40} style={{ marginBottom: '1.5rem' }} />
                            <h3 style={{ marginBottom: '1rem' }}>Beachfront Gigs</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                Catch us performing popular hits at beachfront squares and festivals.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
