import { useState } from "react";
import { Button } from "@headlessui/react";

export default function AlertsPanel({ alerts, user, refreshAlerts }) {
    const [alertText, setAlertText] = useState("");

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
            const response = await fetch("http://localhost:3000/api/alerts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ alert: alertText }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
                return;
            }

            setAlertText("");
            await refreshAlerts();
        } catch (err) {
            console.error("Error saving alert:", err);
        }
    };

    return (
        <div className=" shadow rounded-lg p-6 border">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Your Alerts</h2>

            <div className="flex gap-2 mb-4">
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
                <ul className="list-disc list-inside space-y-1 max-h-48 overflow-y-auto">
                    {alerts.map((alert) => (
                        <li key={alert.id} className="text-gray-800">
                            {alert.alert}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500 text-sm">No alerts yet. Create one above!</p>
            )}
        </div>
    );
}
