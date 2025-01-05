import React, { createContext, useState, useEffect, useContext } from 'react';
import { FIREBASE_AUTH } from '../services/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            try {
                if (user) {
                  setUser(user);
                } else {
                  setUser(null);
                }
              } catch (error) {
                console.log(error);
              } finally {
                setLoading(false);
              }
        });
        return () => unsubscribe();
    }, []);

    const logout = async () => {
        try {
            await signOut(FIREBASE_AUTH);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
export default AuthProvider;