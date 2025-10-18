import { useEffect, useState } from "react";
import { Button } from "@headlessui/react";
import axios from "axios";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";


const Dashboard = () => {
  const [data, setData] = useState(null);
  const [alertText, setAlertText] = useState("");
  const [alertsUserID, setAlertsUserID] = useState("");
  const [alerts, setAlerts] = useState([]);

  const BASE_URL = "http://localhost:3000/";


  const saveAlert = async () => {
    const response = await fetch(BASE_URL + "addalert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ alert: alertText }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching data: ", errorData.message);
      alert(`Error: ${errorData.message}`);
      return;
    }

    // const data = await response.json();
    // console.log(`Data: ${data.uid}`);
  };

  const getAlerts = async () => {
    if (!alertsUserID || alertsUserID.trim() === "") {
      alert("Please enter a user ID");
      return;
    }

    let user_id = parseInt(alertsUserID, 10);

    if (isNaN(user_id)) {
      alert("Please enter a valid number");
      return;
    }

    console.log("Sending user_id:", user_id);

    const response = await fetch(BASE_URL + "getalerts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ user_id }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching data: ", errorData.message);
      alert(`Error: ${errorData.message}`);
      return;
    }

    const data = await response.json();
    console.log("Received data:", data);
    setAlerts(data);
  };

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     if (user) {
  //       try {
  //         const token = await user.getIdToken();
  //         const res = await fetch("http://localhost:3000/api/protected", {
  //           headers: { Authorization: `Bearer ${token}` },
  //         });
  //         const data = await res.json();
  //         console.log("✅ Protected route data:", data);
  //       } catch (err) {
  //         console.error("Error fetching protected data:", err);
  //       }
  //     } else {
  //       console.warn("⚠️ No user logged in. Skipping protected fetch.");
  //     }
  //   });

  //   return () => unsubscribe(); // cleanup
  // }, []);
  return (
    <div>
      <div>
        <input onChange={(e) => setAlertText(e.target.value)} type="text" />
        <Button
          onClick={() => saveAlert()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Save Alert
        </Button>
      </div>
      <div>
        <input onChange={(e) => setAlertsUserID(e.target.value)} type="text" />
        <Button
          onClick={() => getAlerts()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Get Alert by user_id
        </Button>
      </div>


      {alerts && alerts.length > 0 && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Alerts:</h2>
          <ul className="list-disc list-inside">
            {alerts.map((alert, index) => (
              <li key={alert.id || index} className="mb-2">
                <span className="font-medium">Alert:</span> {alert.alert}
                <span className="text-sm text-gray-600 ml-2">
                  (User ID: {alert.user_id})
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
