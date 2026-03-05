import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Calendar, Clock, MapPin, Info, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const defaultRehearsal = {
    date: "Thursday, March 5, 2026",
    time: "7:00 PM - 9:00 PM",
    location: "Costa Brava Community Arts Center",
    address: "Carrer de la Mar, 12, 17220 Sant Feliu de Guíxols, Girona, Spain",
    focus: "Final polish for the 'Summer Beach Hits' concert. We will be focusing on transitions between songs and dynamic markings in 'Dancing Queen'.",
    bring: ["Sheet music folder", "Water bottle", "Pencil for notes", "Your best energy!"],
    imageUrl: "/Volumes/Wookie/Users/Oberyn/.gemini/antigravity/brain/c840c164-81a9-4711-9566-41aa7560605f/rehearsal_venue_mediterranean_1772487036184.png",
    what3wordsUrl: ""
};

const EditRehearsal = () => {
    const navigate = useNavigate();
    const [rehearsal, setRehearsal] = useState(null);
    const [bringInput, setBringInput] = useState('');

    useEffect(() => {
        const fetchRehearsal = async () => {
            try {
                const docRef = doc(db, 'settings', 'next_rehearsal');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setRehearsal(docSnap.data());
                } else {
                    setRehearsal(defaultRehearsal);
                }
            } catch (error) {
                console.error("Error fetching rehearsal:", error);
                setRehearsal(defaultRehearsal);
            }
        };
        fetchRehearsal();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await setDoc(doc(db, 'settings', 'next_rehearsal'), rehearsal);
            navigate('/rehearsal');
        } catch (error) {
            console.error("Error saving rehearsal:", error);
            alert('Failed to save changes');
        }
    };

    const handleAddBring = () => {
        if (bringInput.trim()) {
            setRehearsal({
                ...rehearsal,
                bring: [...rehearsal.bring, bringInput.trim()]
            });
            setBringInput('');
        }
    };

    const removeBring = (index) => {
        const updatedBring = rehearsal.bring.filter((_, i) => i !== index);
        setRehearsal({ ...rehearsal, bring: updatedBring });
    };

    if (!rehearsal) return <div className="container" style={{ padding: '6rem 0' }}>Loading...</div>;

    return (
        <div className="container" style={{ padding: '6rem 0' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <button
                    onClick={() => navigate('/rehearsal')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--accent)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        marginBottom: '2rem',
                        fontWeight: '500',
                        padding: 0
                    }}
                >
                    <ArrowLeft size={18} /> Back to Rehearsal Details
                </button>

                <div className="glass-card" style={{ padding: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--secondary)' }}>Edit Rehearsal Info</h1>

                    <form onSubmit={handleSave} style={{ display: 'grid', gap: '2rem' }}>
                        {/* Date and Time */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                    <Calendar size={16} style={{ marginRight: '0.5rem' }} /> Date
                                </label>
                                <input
                                    type="text"
                                    value={rehearsal.date}
                                    onChange={e => setRehearsal({ ...rehearsal, date: e.target.value })}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}
                                    placeholder="e.g., Thursday, March 5, 2026"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                    <Clock size={16} style={{ marginRight: '0.5rem' }} /> Time
                                </label>
                                <input
                                    type="text"
                                    value={rehearsal.time}
                                    onChange={e => setRehearsal({ ...rehearsal, time: e.target.value })}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}
                                    placeholder="e.g., 7:00 PM - 9:00 PM"
                                />
                            </div>
                        </div>

                        {/* Venue */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                    <MapPin size={16} style={{ marginRight: '0.5rem' }} /> Venue Name
                                </label>
                                <input
                                    type="text"
                                    value={rehearsal.location}
                                    onChange={e => setRehearsal({ ...rehearsal, location: e.target.value })}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                    Address
                                </label>
                                <input
                                    type="text"
                                    value={rehearsal.address}
                                    onChange={e => setRehearsal({ ...rehearsal, address: e.target.value })}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}
                                />
                            </div>
                        </div>

                        {/* what3words */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                what3words URL (Optional)
                            </label>
                            <input
                                type="url"
                                value={rehearsal.what3wordsUrl || ''}
                                onChange={e => setRehearsal({ ...rehearsal, what3wordsUrl: e.target.value })}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}
                                placeholder="e.g., https://what3words.com/filled.count.soap"
                            />
                        </div>

                        {/* Focus */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                <Info size={16} style={{ marginRight: '0.5rem' }} /> Rehearsal Focus
                            </label>
                            <textarea
                                value={rehearsal.focus}
                                onChange={e => setRehearsal({ ...rehearsal, focus: e.target.value })}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', minHeight: '120px', fontFamily: 'inherit' }}
                                placeholder="What will we be working on this week?"
                            />
                        </div>

                        {/* What to Bring */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>What to Bring</label>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                <input
                                    type="text"
                                    value={bringInput}
                                    onChange={e => setBringInput(e.target.value)}
                                    placeholder="Add item..."
                                    style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}
                                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddBring())}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddBring}
                                    className="btn-primary"
                                    style={{ padding: '0 1.5rem' }}
                                >
                                    Add
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {rehearsal.bring.map((item, index) => (
                                    <div key={index} style={{
                                        padding: '0.5rem 1rem',
                                        background: 'var(--accent-light)',
                                        borderRadius: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.9rem'
                                    }}>
                                        {item}
                                        <button
                                            type="button"
                                            onClick={() => removeBring(index)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button
                                type="button"
                                onClick={() => navigate('/rehearsal')}
                                className="btn-outline"
                                style={{ flex: 1, padding: '1rem' }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                                style={{ flex: 1, padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                <Save size={20} /> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default EditRehearsal;
