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
    <div className="min-h-screen  p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Trading Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <AlertsPanel
            alerts={alerts}
            user={user}
            refreshAlerts={() => fetchAlerts(user)}
          />

        </div>
        <div className="flex flex-col gap-6 ">
          <BalanceCard balance={balance} />
          <TransactionsPanel transactions={transactions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
