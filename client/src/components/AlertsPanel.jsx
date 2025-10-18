import { useState } from "react";
import { Button } from "@headlessui/react";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function AlertsPanel({ alerts, user, refreshAlerts }) {
    const [alertText, setAlertText] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    // DELETE an alert
    const deleteAlert = async (alertId) => {
        if (!user) {
            alert("You must be logged in to delete alerts.");
            return;
        }

        try {
            setDeletingId(alertId);
            const token = await user.getIdToken();
            const response = await fetch(`http://localhost:3000/api/alerts/${alertId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
                return;
            }

            await refreshAlerts();
        } catch (err) {
            console.error("Error deleting alert:", err);
        } finally {
            setDeletingId(null);
        }
    };

    // ADD a new alert
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
        <div className="rounded-lg p-6 border bg-gray-800 text-gray-100 flex flex-col shadow-lg h-[445px]">
            {/* Header */}
            <h2 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
                <PlusCircleIcon className="w-5 h-5 text-indigo-400" />
                Your Alerts
            </h2>

            {/* Input + Save Button */}
            <div className="flex gap-2 mb-4">
                <input
                    value={alertText}
                    onChange={(e) => setAlertText(e.target.value)}
                    placeholder="Enter a new alert..."
                    className="flex-grow bg-gray-700 text-gray-100 border border-gray-600 p-2 rounded focus:ring-2 focus:ring-indigo-400 outline-none"
                />
                <Button
                    onClick={saveAlert}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition flex items-center gap-1"
                >
                    <PlusCircleIcon className="w-4 h-4" /> Save
                </Button>
            </div>

            {/* Alerts List */}
            <div className="overflow-y-auto flex-grow pr-1">
                {alerts.length > 0 ? (
                    <ul className="space-y-3">
                        {alerts.map((alert) => (
                            <li
                                key={alert.id}
                                className="bg-gray-700 border border-gray-600 rounded p-3 flex justify-between items-center hover:bg-gray-600 transition"
                            >
                                <div className="flex flex-col">
                                    <p className="text-gray-100 break-words">{alert.alert}</p>
                                    {alert.createdAt && (
                                        <small className="text-gray-400 text-xs">
                                            {new Date(alert.createdAt).toLocaleString()}
                                        </small>
                                    )}
                                </div>

                                <button
                                    onClick={() => deleteAlert(alert.id)}
                                    disabled={deletingId === alert.id}
                                    className={`p-2 rounded hover:bg-red-600 transition ${deletingId === alert.id ? "opacity-50 cursor-not-allowed" : "hover:text-white"
                                        }`}
                                    title="Delete alert"
                                >
                                    <TrashIcon className="w-5 h-5 text-red-400" />
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400 text-sm">No alerts yet. Create one above!</p>
                )}
            </div>
        </div>
    );
}
