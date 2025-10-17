import { useEffect, useState } from "react"
import { Button } from "@headlessui/react";
import axios from 'axios';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };
    useEffect(() => {
    }, [])
    return (
        <div>
            <Button onClick={() => fetchData()} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                Fetch Gemini Data
            </Button>
            {data && (
                <div className="mt-4 p-4 border rounded">
                    <h2 className="text-lg font-semibold mb-2">Gemini Response:</h2>
                    <p>{data}</p>
                </div>
            )}
        </div>
    )
}

export default Dashboard