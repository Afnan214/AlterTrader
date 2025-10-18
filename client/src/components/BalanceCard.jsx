export default function BalanceCard({ balance }) {
    return (
        <div className="shadow rounded-lg p-6 border">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Current Balance</h2>
            <p className="text-3xl font-bold text-indigo-600">
                ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
        </div>
    );
}
