import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Info, ArrowLeft, ExternalLink, Edit2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const defaultRehearsal = {
    date: "Thursday, March 5, 2026",
    time: "7:00 PM - 9:00 PM",
    location: "Costa Brava Community Arts Center",
    address: "Carrer de la Mar, 12, 17220 Sant Feliu de Guíxols, Girona, Spain",
    focus: "Final polish for the 'Summer Beach Hits' concert. We will be focusing on transitions between songs and dynamic markings in 'Dancing Queen'.",
    bring: ["Sheet music folder", "Water bottle", "Pencil for notes", "Your best energy!"],
    imageUrl: "/Volumes/Wookie/Users/Oberyn/.gemini/antigravity/brain/c840c164-81a9-4711-9566-41aa7560605f/rehearsal_venue_mediterranean_1772487036184.png"
};

const RehearsalDetail = () => {
    const { user } = useAuth();
    const isAdmin = user?.isAdmin || user?.isSuperAdmin;
    const navigate = useNavigate();
    const [rehearsal, setRehearsal] = useState(null);

    useEffect(() => {
        const fetchRehearsal = async () => {
            try {
                const docRef = doc(db, 'settings', 'next_rehearsal');
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setRehearsal(docSnap.data());
                } else {
                    // Initialize with default if not found
                    await setDoc(docRef, defaultRehearsal);
                    setRehearsal(defaultRehearsal);
                }
            } catch (error) {
                console.error("Error fetching rehearsal:", error);
                setRehearsal(defaultRehearsal);
            }
        };
        fetchRehearsal();
    }, []);

    if (!rehearsal) return <div className="container" style={{ padding: '6rem 0' }}>Loading...</div>;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Link to="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--accent)',
                    textDecoration: 'none',
                    marginBottom: '2rem',
                    fontWeight: '500'
                }}>
                    <ArrowLeft size={18} /> Back to Home
                </Link>

                <div className="glass-card" style={{ padding: 0, overflow: 'hidden', border: 'none' }}>
                    {/* Hero Image */}
                    <div style={{
                        height: '150px',
                        width: '100%',
                        backgroundImage: `url(${rehearsal.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative'
                    }}>
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            padding: '1.5rem',
                            background: 'rgba(0, 31, 63, 0.9)', // Solid dark blue with high opacity
                            color: 'white',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                            flexWrap: 'wrap',
                            gap: '1rem'
                        }}>
                            <div>
                                <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', marginBottom: '0.5rem', color: 'white' }}>Next Rehearsal</h1>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.9rem', color: 'white', fontWeight: '500' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <Calendar size={18} /> {rehearsal.date}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <Clock size={18} /> {rehearsal.time}
                                    </span>
                                </div>
                            </div>
                            {isAdmin && (
                                <button
                                    onClick={() => navigate('/admin/edit-rehearsal')}
                                    className="btn-primary"
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem' }}
                                >
                                    <Edit2 size={18} /> Edit Rehearsal
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '2rem' }}>
                        <div className="responsive-grid" style={{ '--grid-cols': '1.5fr 1fr' }}>
                            {/* Main Info */}
                            <div>
                                <section style={{ marginBottom: '2.5rem' }}>
                                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', color: 'var(--secondary)', marginBottom: '1.2rem' }}>
                                        <Info size={24} color="var(--accent)" /> Weekly Focus
                                    </h2>
                                    <p style={{ lineHeight: '1.8', color: 'var(--text-main)', padding: '1.5rem', background: 'rgba(0, 119, 190, 0.05)', borderRadius: '12px', borderLeft: '4px solid var(--accent)' }}>
                                        {rehearsal.focus}
                                    </p>
                                </section>

                                <section>
                                    <h2 style={{ color: 'var(--secondary)', marginBottom: '1.2rem' }}>What to Bring</h2>
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {rehearsal.bring.map((item, index) => (
                                            <li key={index} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.8rem',
                                                marginBottom: '0.8rem',
                                                color: 'var(--text-main)'
                                            }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }}></div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            </div>

                            {/* Sidebar / Location */}
                            <div style={{ background: '#f8fbff', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', alignSelf: 'start' }}>
                                <h3 style={{ color: 'var(--secondary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <MapPin size={20} color="var(--accent)" /> Venue Details
                                </h3>

                                <p style={{ fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.2rem' }}>{rehearsal.location}</p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                                    {rehearsal.address}
                                </p>

                                {rehearsal.what3wordsUrl && (
                                    <a
                                        href={rehearsal.what3wordsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-outline"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            padding: '0.8rem',
                                            width: '100%',
                                            fontSize: '0.9rem',
                                            textDecoration: 'none',
                                            color: '#E11F26', // what3words signature red
                                            borderColor: '#E11F26'
                                        }}
                                    >
                                        <MapPin size={16} /> what3words Address
                                    </a>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default RehearsalDetail;
