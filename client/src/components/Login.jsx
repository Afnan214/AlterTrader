import { useState } from "react";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, loading, error } = useFirebaseAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            alert("✅ Logged in successfully!");
            navigate("/dashboard");

        } catch (err) {
            console.error("Login error:", err);
            alert("Invalid credentials or error logging in.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3 max-w-sm mx-auto mt-10">
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
            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
            >
                {loading ? "Logging in..." : "Login"}
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
    );
}
