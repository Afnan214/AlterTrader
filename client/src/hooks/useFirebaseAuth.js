// src/hooks/useFirebaseAuth.js
import { useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { auth } from "../firebase";

export function useFirebaseAuth() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const register = async (email, password) => {
        try {
            setLoading(true);
            setError(null);
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            return userCred.user;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            setLoading(true);
            setError(null);
            const userCred = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCred.user.getIdToken();
            localStorage.setItem("token", token); // ✅ store token for backend use later
            return userCred.user;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await signOut(auth);
        localStorage.removeItem("token");
    };

    return { register, login, logout, loading, error };
}
