import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import AlertsPanel from "../components/AlertsPanel";
import BalanceCard from "../components/BalanceCard";
import TransactionsPanel from "../components/TransactionsPanel";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const BASE_URL = "http://localhost:3000/api";

  // Track logged-in user
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
      } else {
        setUser(null);
        setAlerts([]);
        setTransactions([]);
        setBalance(0);
      }
    });
    return () => unsubscribe();
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
