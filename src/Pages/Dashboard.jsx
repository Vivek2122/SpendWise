import axios from "axios";
import Sidebar from "../Components/Sidebar";
import TitleBar from "../Components/TitleBar";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import PlotBarChart from "../Components/PlotBarChart";
import {
    WalletMinimal,
    BanknoteArrowUp,
    BanknoteArrowDown,
    MoveRight,
    TrendingUp,
    TrendingDown,
    Download // <-- Added for the CSV Button
} from "lucide-react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip as RechartsTooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { useState } from "react";

// --- NEW FEATURE 1: Budget Progress Bar Component ---
const BudgetProgress = ({ totalSpent, budgetLimit = 2000 }) => {
    // Cap the percentage at 100 so the bar doesn't break the layout
    const percentage = Math.min((totalSpent / budgetLimit) * 100, 100);
    
    // HCI Color Logic
    const getBarColor = () => {
        if (percentage < 50) return "bg-green-500";
        if (percentage < 80) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <div className="mt-4 w-full">
            <div className="flex justify-between text-xs font-medium text-gray-500 mb-1">
                <span>Monthly Budget</span>
                <span className={percentage >= 100 ? "text-red-600 font-bold" : ""}>
                    {percentage.toFixed(0)}% Used
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div 
                    className={`h-full transition-all duration-500 ${getBarColor()}`} 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <p className="text-xs text-gray-400 mt-1 text-right">
                ${Math.max(budgetLimit - totalSpent, 0).toFixed(2)} remaining
            </p>
        </div>
    );
};
// ---------------------------------------------------

function Dashboard() {
    const { data } = useQuery({
        queryKey: ["allTransactions"],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/dashboard`, {
                withCredentials: true,
            });
            return res.data.transactions;
        },
    });

    const incomeTransactions = data?.filter((tx) => tx.type === "income") || [];
    const expenseTransactions = data?.filter((tx) => tx.type === "expense") || [];
    const recentTransactions = data?.slice(0, 7) || [];

    const totalIncome = incomeTransactions.reduce(
        (total, tx) => total + tx.amount,
        0
    );
    const totalExpense = expenseTransactions.reduce(
        (total, tx) => total + tx.amount,
        0
    );
    const totalBalance = totalIncome - totalExpense;

    const recentExpenses = expenseTransactions.slice(0, 7);
    const recentIncomes = incomeTransactions.slice(0, 7);

    const pieChartData = [
        { name: "Balance", value: totalBalance },
        { name: "Income", value: totalIncome },
        { name: "Expense", value: totalExpense },
    ];

    const COLORS = ["#4f46e5", "#22c55e", "#ef4444"];
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- NEW FEATURE 2: CSV Export Function ---
    const downloadCSV = () => {
        if (!data || data.length === 0) return;

        const headers = ["Date,Source,Amount,Type\n"];
        const rows = data.map(tx => 
            // Wrapping source in quotes just in case they typed a comma in the name!
            `${tx.date.slice(0, 10)},"${tx.source}",${tx.amount},${tx.type}\n`
        );

        const csvContent = headers.concat(rows).join("");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        
        link.setAttribute("href", url);
        link.setAttribute("download", "SpendWise_Transactions.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    // ------------------------------------------

    return (
        <div className="bg-gray-50 min-h-screen w-screen overflow-x-hidden">
            <TitleBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={() => setIsSidebarOpen(false)}
            />

            <main className="pt-24 p-6 overflow-y-auto overflow-x-hidden min-h-screen transition-all duration-300 ml-16 lg:ml-64">
                
                {/* Header Section with Export Button */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h1 className="text-2xl font-bold text-gray-800">Financial Dashboard</h1>
                    <button 
                        onClick={downloadCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:text-indigo-600 transition shadow-sm font-medium text-sm"
                    >
                        <Download size={16} />
                        Export Data (CSV)
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="flex flex-col p-5 bg-white rounded-xl shadow hover:shadow-md transition">
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded-full bg-purple-600 text-white">
                                <WalletMinimal size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Balance</p>
                                <p className="text-lg font-bold text-gray-800">${totalBalance.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col p-5 bg-white rounded-xl shadow hover:shadow-md transition">
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded-full bg-green-500 text-white">
                                <BanknoteArrowUp size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Income</p>
                                <p className="text-lg font-bold text-gray-800">${totalIncome.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col p-5 bg-white rounded-xl shadow hover:shadow-md transition">
                       <div className="flex items-center gap-4 mb-2">
                            <div className="p-2 rounded-full bg-red-500 text-white">
                                <BanknoteArrowDown size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Expense</p>
                                <p className="text-lg font-bold text-gray-800">${totalExpense.toFixed(2)}</p>
                            </div>
                        </div>
                        {/* Dynamic Budget Progress Bar */}
                        <BudgetProgress 
                            totalSpent={totalExpense} 
                            budgetLimit={totalIncome > 0 ? (totalIncome * 0.8) : 1000} 
                        />
                        {/* HCI Transparency Text */}
                        <p className="text-[10px] text-gray-400 mt-2 text-center italic">
                            *Budget limit automatically set to 80% of total income.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 px-4">

                    {/* 1 - Recent Transactions */}
                    <div className="flex flex-col bg-white p-3 sm:p-6 rounded-xl shadow-md min-w-0">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-base sm:text-lg font-bold">
                                Recent Transactions
                            </span>
                            <Link
                                to={"/transaction/income"}
                                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold transition"
                            >
                                See All <MoveRight size={16} />
                            </Link>
                        </div>

                        <div className="overflow-auto w-full max-w-full">
                            <table className="min-w-full table-auto text-sm">
                                <tbody>
                                    {recentTransactions.map((tx) => {
                                        const isIncome = tx.type === "income";
                                        return (
                                            <tr
                                                key={tx._id}
                                                className="border-b last:border-b-0 hover:bg-gray-50 transition"
                                            >
                                                <td className="py-2 px-4">
                                                    <div className="flex items-center gap-2">
                                                        {isIncome ? (
                                                            <TrendingUp
                                                                className="text-green-500"
                                                                size={16}
                                                            />
                                                        ) : (
                                                            <TrendingDown
                                                                className="text-red-500"
                                                                size={16}
                                                            />
                                                        )}
                                                        <span className="text-gray-900 font-medium text-sm">
                                                            {tx.source}
                                                        </span>
                                                    </div>
                                                    <div className="text-gray-500 text-xs">
                                                        {tx.date.slice(0, 10)}
                                                    </div>
                                                </td>
                                                <td className="py-2 px-4 text-right font-semibold text-sm">
                                                    <div
                                                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${
                                                            isIncome
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-red-100 text-red-700"
                                                        }`}
                                                    >
                                                        <span>${tx.amount.toFixed(2)}</span>
                                                        {isIncome ? (
                                                            <TrendingUp size={16} />
                                                        ) : (
                                                            <TrendingDown size={16} />
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 2 - Financial Overview */}
                    <div className="flex flex-col bg-white p-3 sm:p-6 rounded-xl shadow-md min-w-0">
                        <span className="text-base sm:text-lg font-bold">
                            Financial Overview
                        </span>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    labelLine={false}
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    formatter={(value, name) => [`$${value.toFixed(2)}`, name]}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* 3 - Recent Incomes */}
                    <div className="flex flex-col bg-white p-3 sm:p-6 rounded-xl shadow-md min-w-0">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-base sm:text-lg font-bold">
                                Recent Incomes
                            </span>

                            <Link
                                to={"/transaction/income"}
                                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold transition"
                            >
                                See All <MoveRight size={16} />
                            </Link>
                        </div>
                        <div className="overflow-auto w-full max-w-full">
                            <table className="min-w-full table-auto text-sm">
                                <tbody>
                                    {recentIncomes.map((tx) => (
                                        <tr
                                            key={tx._id}
                                            className="border-b last:border-b-0 hover:bg-gray-50 transition"
                                        >
                                            <td className="py-2 px-4">
                                                <div className="flex items-center gap-2">
                                                    <TrendingUp className="text-green-500" size={16} />
                                                    <span className="text-gray-900 font-medium text-sm">
                                                        {tx.source}
                                                    </span>
                                                </div>
                                                <div className="text-gray-500 text-xs">
                                                    {tx.date.slice(0, 10)}
                                                </div>
                                            </td>
                                            <td className="py-2 px-4 text-right font-semibold text-sm">
                                                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700">
                                                    <span>${tx.amount.toFixed(2)}</span>
                                                    <TrendingUp size={16} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>{" "}
                        </div>
                    </div>

                    {/* 4 - Recent Expenses */}
                    <div className="flex flex-col bg-white p-3 sm:p-6 rounded-xl shadow-md min-w-0">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-base sm:text-lg font-bold">
                                Recent Expenses
                            </span>
                            <Link
                                to={"/transaction/expense"}
                                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold transition"
                            >
                                See All <MoveRight size={16} />
                            </Link>
                        </div>
                        <div className="overflow-auto w-full max-w-full">
                            <table className="min-w-full table-auto text-sm">
                                <tbody>
                                    {recentExpenses.map((tx) => (
                                        <tr
                                            key={tx._id}
                                            className="border-b last:border-b-0 hover:bg-gray-50 transition"
                                        >
                                            <td className="py-2 px-4">
                                                <div className="flex items-center gap-2">
                                                    <TrendingDown className="text-red-500" size={16} />
                                                    <span className="text-gray-900 font-medium text-sm">
                                                        {tx.source}
                                                    </span>
                                                </div>
                                                <div className="text-gray-500 text-xs">
                                                    {tx.date.slice(0, 10)}
                                                </div>
                                            </td>
                                            <td className="py-2 px-4 text-right font-semibold text-sm">
                                                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700">
                                                    <span>${tx.amount.toFixed(2)}</span>
                                                    <TrendingDown size={16} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>{" "}
                        </div>
                    </div>

                    {/* 5 - Last 30 Days Income */}
                    <div className="flex flex-col bg-white p-3 sm:p-6 rounded-xl shadow-md min-w-0">
                        <span className="text-base sm:text-lg font-bold">
                            Last 30 Days Income
                        </span>
                        <PlotBarChart
                            transactions={incomeTransactions}
                            barColor="#22c55e"
                        />
                    </div>

                    {/* 6 - Last 30 Days Expense */}
                    <div className="flex flex-col bg-white p-3 sm:p-6 rounded-xl shadow-md min-w-0">
                        <span className="text-base sm:text-lg font-bold">
                            Last 30 Days Expense
                        </span>
                        <PlotBarChart
                            transactions={expenseTransactions}
                            barColor="#ef4444"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
                           