export default function BalanceCard({ balance }) {
    return (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-gray-100 shadow-md h-[120px] flex flex-col justify-center">
            <h2 className="text-lg font-semibold text-gray-200 mb-2">Current Balance</h2>
            <p className="text-2xl md:text-3xl font-bold text-indigo-400">
                ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
        </div>
    );
}
