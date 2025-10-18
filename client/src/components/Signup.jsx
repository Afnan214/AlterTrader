import { useState } from "react";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // ✅ to get ID token
import {
    createUserWithEmailAndPassword,
} from "firebase/auth";
export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [balance, setBalance] = useState(""); // ✅ new
    const { register, loading, error } = useFirebaseAuth();
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // ✅ Step 1: Create Firebase user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // ✅ Step 2: Get Firebase UID and ID token
            const uid = user.uid;
            const token = await user.getIdToken();

            // ✅ Step 3: Send UID, email, and balance to backend
            const res = await fetch("http://localhost:3000/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: uid,        // ✅ Firebase UID used as Postgres ID
                    email,
                    balance,
                }),
            });

            if (!res.ok) throw new Error("Failed to sync user to backend");

            console.log("✅ User synced:", await res.json());
            navigate("/dashboard");
        } catch (err) {
            console.error("Signup error:", err);
            alert("Error creating account. Please try again.");
        }
    };


    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-3 max-w-sm mx-auto mt-10  shadow p-6 rounded"
        >
            <h2 className="text-lg font-semibold text-center mb-4">Create Account</h2>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 w-full rounded"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 w-full rounded"
            />

            {/* ✅ New input for initial balance */}
            <input
                type="number"
                placeholder="Initial Balance"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="border p-2 w-full rounded"
            />

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
            >
                {loading ? "Creating..." : "Sign Up"}
            </button>

            {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
    );
}
