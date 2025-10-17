import { useEffect, useState } from "react";
import { Button } from "@headlessui/react";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState(null);

  const BASE_URL = "http://localhost:3000/";

  const gemini = async () => {
    try {
      const response = await axios.get(BASE_URL);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const addAlert = async () => {
    const response = await fetch(BASE_URL + "addalert");
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
        <Button
          onClick={() => fetchData()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Get Data
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
