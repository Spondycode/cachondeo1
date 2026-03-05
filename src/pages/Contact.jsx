import React, { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Contact = () => {
    const [formData, setFormData] = useState({ email: '', message: '' });
    const [status, setStatus] = useState({ type: '', text: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', text: '' });

        try {
            await addDoc(collection(db, 'messages'), {
                ...formData,
                timestamp: serverTimestamp()
            });
            setStatus({ type: 'success', text: 'Thank you! Your message has been sent successfully.' });
            setFormData({ email: '', message: '' });
        } catch (error) {
            console.error("Error sending message:", error);
            setStatus({ type: 'error', text: 'Failed to send message. Please try again later.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container" style={{ padding: '8rem 2rem 4rem' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', marginBottom: '4rem' }}
                >
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>CONTACT US</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                        Have a question or want to book the choir? Drop us a message below.
                    </p>
                    <div style={{ width: '80px', height: '3px', background: 'var(--accent)', margin: '2rem auto 0' }}></div>
                </motion.div>

                <div className="glass-card" style={{ padding: '3rem' }}>
                    {status.text ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                textAlign: 'center',
                                padding: '2rem',
                                color: status.type === 'success' ? 'var(--secondary)' : 'var(--accent)'
                            }}
                        >
                            {status.type === 'success' ? (
                                <>
                                    <CheckCircle size={64} style={{ marginBottom: '1.5rem', opacity: 0.8 }} />
                                    <h2 style={{ marginBottom: '1rem' }}>Message Sent!</h2>
                                </>
                            ) : (
                                <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--accent)' }}>Oops!</h1>
                            )}
                            <p>{status.text}</p>
                            <button
                                onClick={() => setStatus({ type: '', text: '' })}
                                className="btn-outline"
                                style={{ marginTop: '2rem' }}
                            >
                                Send Another Message
                            </button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '2rem' }}>
                            <div style={{ display: 'grid', gap: '0.8rem' }}>
                                <label style={{ fontWeight: '600', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Mail size={18} /> Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        borderRadius: '8px',
                                        border: '1px solid var(--glass-border)',
                                        fontSize: '1rem',
                                        background: 'rgba(255, 255, 255, 0.5)'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'grid', gap: '0.8rem' }}>
                                <label style={{ fontWeight: '600', color: 'var(--text-main)' }}>Your Message</label>
                                <textarea
                                    placeholder="How can we help you?"
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        borderRadius: '8px',
                                        border: '1px solid var(--glass-border)',
                                        fontSize: '1rem',
                                        minHeight: '200px',
                                        background: 'rgba(255, 255, 255, 0.5)',
                                        fontFamily: 'inherit',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={isSubmitting}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.8rem',
                                    padding: '1.2rem',
                                    fontSize: '1.1rem',
                                    marginTop: '1rem',
                                    opacity: isSubmitting ? 0.7 : 1,
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isSubmitting ? 'Sending...' : (
                                    <>
                                        <Send size={20} /> Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                <div style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <p style={{ fontStyle: 'italic' }}>
                        "Where words fail, music speaks."
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Contact;
