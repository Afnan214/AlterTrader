import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        console.log("✅ User still logged in:", firebaseUser.email);
        setUser(firebaseUser);
      } else {
        console.log("❌ No user logged in");
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          {/* Add more routes for other pages */}
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
