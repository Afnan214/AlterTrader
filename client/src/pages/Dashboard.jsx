import { useEffect, useState } from "react";
import { Button } from "@headlessui/react";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [alert, setAlert] = useState("");

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

      body: JSON.stringify({ alert }),
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
        <input onChange={(e) => setAlert(e.target.value)} type="text" />
        <Button
          onClick={() => saveAlert()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Save Alert
        </Button>
      </div>
      {data && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Gemini Response:</h2>
          <p>{data}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
