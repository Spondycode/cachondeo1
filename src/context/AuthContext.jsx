import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updatePassword,
    sendPasswordResetEmail
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
                setLoading(true);
                try {
                    const userDoc = await getDoc(doc(db, 'members', firebaseUser.uid));
                    const userData = userDoc.data();

                    const isSuperAdmin = firebaseUser.email === 'spondycodedev@gmail.com' || userData?.role === 'superadmin';
                    const isAdmin = isSuperAdmin || userData?.role === 'admin' || userData?.isAdmin === true;

                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        name: userData?.name || (isSuperAdmin ? 'Super Admin' : isAdmin ? 'Admin' : 'Choir Member'),
                        voicePart: userData?.voicePart || (isAdmin ? 'N/A' : 'Unassigned'),
                        role: userData?.role || (isSuperAdmin ? 'superadmin' : isAdmin ? 'admin' : 'member'),
                        isAdmin: isAdmin,
                        isSuperAdmin: isSuperAdmin
                    });
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    const isSuperAdmin = firebaseUser.email === 'spondycodedev@gmail.com';
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        isAdmin: isSuperAdmin,
                        isSuperAdmin: isSuperAdmin,
                        role: isSuperAdmin ? 'superadmin' : 'member'
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
            console.error("Login failed:", error.code, error.message);
            let message = "Invalid email or password.";
            if (error.code === 'auth/user-not-found') message = "No account found with this email.";
            if (error.code === 'auth/wrong-password') message = "Incorrect password.";
            if (error.code === 'auth/invalid-credential') message = "Invalid login credentials.";
            return { success: false, error: message, code: error.code };
        }
    };

    const resetPassword = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            return { success: true };
        } catch (error) {
            console.error("Password reset failed:", error.code, error.message);
            let message = "Failed to send reset email.";
            if (error.code === 'auth/user-not-found') message = "No account found with this email.";
            if (error.code === 'auth/invalid-email') message = "Invalid email address.";
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
            const { password, ...firestoreData } = updatedData;

            // 1. If password is provided, update it in Firebase Auth
            if (password) {
                await updatePassword(auth.currentUser, password);
            }

            // 2. Update other fields in Firestore
            const userRef = doc(db, 'members', user.uid);
            await setDoc(userRef, firestoreData, { merge: true });

            setUser(prev => ({ ...prev, ...firestoreData }));
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
        resetPassword,
        updateUserProfile,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
