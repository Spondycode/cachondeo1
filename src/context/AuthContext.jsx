import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Fetch extra user data from Firestore
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                    const userData = userDoc.data();

                    const isAdmin = firebaseUser.email === 'spondycodedev@gmail.com';

                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        name: userData?.name || (isAdmin ? 'Admin' : 'Choir Member'),
                        voicePart: userData?.voicePart || (isAdmin ? 'N/A' : 'Unassigned'),
                        isAdmin: isAdmin || userData?.isAdmin || false
                    });
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        isAdmin: firebaseUser.email === 'spondycodedev@gmail.com'
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (error) {
            console.error("Login failed:", error.message);
            let message = "Invalid email or password.";
            if (error.code === 'auth/user-not-found') message = "No account found with this email.";
            if (error.code === 'auth/wrong-password') message = "Incorrect password.";
            if (error.code === 'auth/invalid-credential') message = "Invalid login credentials.";
            return { success: false, error: message };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed:", error.message);
        }
    };

    const updateUserProfile = async (updatedData) => {
        if (!user) return false;
        try {
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, updatedData, { merge: true });
            setUser(prev => ({ ...prev, ...updatedData }));
            return true;
        } catch (error) {
            console.error("Profile update failed:", error.message);
            return false;
        }
    };

    const value = {
        user,
        login,
        logout,
        updateUserProfile,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
