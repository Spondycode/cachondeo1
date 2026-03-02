import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize mock data in localStorage
    useEffect(() => {
        const savedUser = localStorage.getItem('choir_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

        // Initialize members if not exists
        if (!localStorage.getItem('choir_members')) {
            localStorage.setItem('choir_members', JSON.stringify([]));
        }

        // Initialize songs if not exists
        if (!localStorage.getItem('choir_songs')) {
            const initialSongs = [
                { id: 1, title: "Dancing Queen", composer: "ABBA", pdf: "#", audio: "#" },
                { id: 2, title: "Bohemian Rhapsody", composer: "Queen", pdf: "#", audio: "#" },
                { id: 3, title: "Imagine", composer: "John Lennon", pdf: "#", audio: "#" },
                { id: 4, title: "Viva La Vida", composer: "Coldplay", pdf: "#", audio: "#" }
            ];
            localStorage.setItem('choir_songs', JSON.stringify(initialSongs));
        }

        setLoading(false);
    }, []);

    const login = (email, password) => {
        if (email && password) {
            const isAdmin = email === 'spondicious@protonmail.com';

            // Check if member exists in storage
            const storedMembers = JSON.parse(localStorage.getItem('choir_members') || '[]');
            const member = storedMembers.find(m => m.email === email && m.password === password);

            if (!isAdmin && !member) {
                // If it's not admin and not a recognized member, we can still allow login for demo
                // but let's try to find them by email at least
                const existingByEmail = storedMembers.find(m => m.email === email);
                if (existingByEmail && existingByEmail.password !== password) {
                    return false; // Wrong password if they exist
                }
            }

            const mockUser = {
                email,
                name: isAdmin ? 'Admin' : (member ? member.name : 'Choir Member'),
                voicePart: member ? member.voicePart : (isAdmin ? 'N/A' : 'Unassigned'),
                isAdmin: isAdmin
            };
            setUser(mockUser);
            localStorage.setItem('choir_user', JSON.stringify(mockUser));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('choir_user');
    };

    const value = {
        user,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
