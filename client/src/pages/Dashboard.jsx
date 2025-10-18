import { useEffect, useState } from "react";
import { Button } from "@headlessui/react";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [alertText, setAlertText] = useState("");
  const [alertsUserID, setAlertsUserID] = useState("");
  const [alerts, setAlerts] = useState([]);

  const BASE_URL = "http://localhost:3000/";

  const gemini = async () => {
    try {
      const response = await axios.get(BASE_URL);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

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

  useEffect(() => {}, []);
  return (
    <div>
      <div>
        <Button
          onClick={() => gemini()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Fetch Gemini Data
        </Button>
      </div>

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
      {data && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Gemini Response:</h2>
          <p>{data}</p>
        </div>
      )}

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
