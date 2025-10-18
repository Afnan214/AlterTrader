export default function TransactionsPanel({ transactions }) {
    return (
        <div className="rounded-lg p-6 border bg-gray-800 text-gray-100 shadow-lg h-[300px] flex flex-col">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">
                Recent Transactions
            </h2>

            {transactions.length > 0 ? (
                <div className="overflow-y-auto flex-grow">
                    <table className="w-full text-sm text-gray-100">
                        <thead className="border-b border-gray-700 font-semibold text-gray-200">
                            <tr>
                                <th className="text-left py-2">Type</th>
                                <th className="text-left py-2">Ticker</th>
                                <th className="text-left py-2">Amount</th>
                                <th className="text-left py-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="border-b border-gray-700 last:border-none">
                                    <td
                                        className={`py-2 font-medium ${tx.transactionType === "BUY"
                                            ? "text-green-400"
                                            : "text-red-400"
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
                </div>
            ) : (
                <p className="text-gray-400 text-sm">No transactions yet.</p>
            )}
        </div>
    );
}
