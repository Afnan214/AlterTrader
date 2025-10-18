import { useEffect, useState } from "react";
import { Button } from "@headlessui/react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const Dashboard = () => {
  const [alertText, setAlertText] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [user, setUser] = useState(null);
  const BASE_URL = "http://localhost:3000/api/alerts";

  // ✅ Track current Firebase user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        console.log("✅ Logged in as:", firebaseUser.email);
        setUser(firebaseUser);
        fetchAlerts(firebaseUser); // automatically load alerts when logged in
      } else {
        console.warn("⚠️ No user logged in");
        setUser(null);
        setAlerts([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // ✅ Create a new alert for the logged-in user
  const saveAlert = async () => {
    if (!user) {
      alert("You must be logged in to save alerts.");
      return;
    }
    if (!alertText.trim()) {
      alert("Please enter an alert message.");
      return;
    }

    try {
      const token = await user.getIdToken();
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ alert: alertText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error creating alert:", errorData.error);
        alert(`Error: ${errorData.error}`);
        return;
      }

      const newAlert = await response.json();
      console.log("✅ Created alert:", newAlert);

      setAlerts((prev) => [newAlert, ...prev]);
      setAlertText(""); // reset field
    } catch (err) {
      console.error("Error saving alert:", err);
      alert("Failed to save alert. Try again.");
    }
  };

  // ✅ Fetch all alerts for logged-in user
  const fetchAlerts = async (firebaseUser = user) => {
    if (!firebaseUser) return;

    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch(BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        console.error("Error fetching alerts:", await response.text());
        return;
      }

      const data = await response.json();
      console.log("✅ Fetched alerts:", data);
      setAlerts(data);
    } catch (err) {
      console.error("Error fetching alerts:", err);
    }
  };

  // ✅ Refresh alerts when user changes
  useEffect(() => {
    if (user) fetchAlerts();
  }, [user]);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4 text-center">Your Alerts</h1>

      <div className="flex items-center gap-2 mb-6">
        <input
          value={alertText}
          onChange={(e) => setAlertText(e.target.value)}
          placeholder="Enter a new alert..."
          className="flex-grow border p-2 rounded"
        />
        <Button
          onClick={saveAlert}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Save
        </Button>
      </div>

      {alerts.length > 0 ? (
        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Your Alerts</h2>
          <ul className="list-disc list-inside space-y-1">
            {alerts.map((alert, index) => (
              <li key={alert.id || index} className="text-gray-800">
                {alert.alert}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-500 text-center">No alerts yet. Create one above!</p>
      )}
    </div>
  );
};

export default Dashboard;
