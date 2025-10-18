export default function TransactionsPanel({ transactions }) {
    return (
        <div className="shadow rounded-lg p-6 border">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Recent Transactions
            </h2>

            {transactions.length > 0 ? (
                <table className="w-full text-sm text-gray-600">
                    <thead className="border-b font-semibold text-gray-800">
                        <tr>
                            <th className="text-left py-2">Type</th>
                            <th className="text-left py-2">Ticker</th>
                            <th className="text-left py-2">Amount</th>
                            <th className="text-left py-2">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx) => (
                            <tr key={tx.id} className="border-b last:border-none">
                                <td
                                    className={`py-2 font-medium ${tx.transactionType === "BUY"
                                        ? "text-green-600"
                                        : "text-red-600"
                                        }`}
                                >
                                    {tx.transactionType}
                                </td>
                                <td className="py-2">{tx.ticker}</td>
                                <td className="py-2">${tx.amount}</td>
                                <td className="py-2">
                                    {new Date(tx.transactionDate).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-500 text-sm">No transactions yet.</p>
            )}
        </div>
    );
}
