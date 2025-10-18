import { useEffect, useState, useRef } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { io } from "socket.io-client";
import AlertsPanel from "../components/AlertsPanel";
import BalanceCard from "../components/BalanceCard";
import TransactionsPanel from "../components/TransactionsPanel";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const BASE_URL = "http://localhost:3000/api";
  const socketRef = useRef(null);

  // Track logged-in user and setup WebSocket
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log("✅ Logged in as:", firebaseUser.email);
        setUser(firebaseUser);
        await Promise.all([
          fetchBalance(firebaseUser),
          fetchAlerts(firebaseUser),
          fetchTransactions(firebaseUser),
        ]);

        // Setup WebSocket connection
        const token = await firebaseUser.getIdToken();
        socketRef.current = io("http://localhost:3000", {
          auth: { token },
        });

        socketRef.current.on("connect", () => {
          console.log("🔌 WebSocket connected:", socketRef.current.id);
        });

        socketRef.current.on("newTransaction", (transaction) => {
          console.log("📥 Received new transaction:", transaction);
          // Add the new transaction to the beginning of the list
          setTransactions((prev) => [transaction, ...prev]);
        });

        socketRef.current.on("balanceUpdate", (newBalance) => {
          console.log("📥 Received balance update:", newBalance);
          // Update the balance
          setBalance(newBalance);
        });

        socketRef.current.on("disconnect", () => {
          console.log("👋 WebSocket disconnected");
        });
      } else {
        setUser(null);
        setAlerts([]);
        setTransactions([]);
        setBalance(0);

        // Disconnect socket if user logs out
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      }
    });

    return () => {
      unsubscribe();
      // Clean up socket connection when component unmounts
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const fetchBalance = async (firebaseUser = user) => {
    if (!firebaseUser) return;
    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch(`${BASE_URL}/users/${firebaseUser.uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setBalance(data.balance || 0);
    } catch (err) {
      console.error("Error fetching balance:", err);
    }
  };

  const fetchAlerts = async (firebaseUser = user) => {
    if (!firebaseUser) return;
    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch(`${BASE_URL}/alerts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setAlerts(data || []);
    } catch (err) {
      console.error("Error fetching alerts:", err);
    }
  };

  const fetchTransactions = async (firebaseUser = user) => {
    if (!firebaseUser) return;
    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch(`${BASE_URL}/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setTransactions(data || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-6 bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100">
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-6 justify-center items-start">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6 w-full lg:w-[60%]">
          <AlertsPanel
            alerts={alerts}
            user={user}
            refreshAlerts={() => fetchAlerts(user)}
          />
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6 w-full lg:w-[35%]">
          <BalanceCard balance={balance} />
          <TransactionsPanel transactions={transactions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
