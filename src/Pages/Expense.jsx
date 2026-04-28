// import { useState, useEffect } from "react";
// import ExpenseModal from "../Modals/ExpenseModal";
// import TitleBar from "../Components/TitleBar";
// import Sidebar from "../Components/Sidebar";
// import Table from "../Components/Table";
// import { useQuery } from "@tanstack/react-query";
// import {
// 	LineChart,
// 	Line,
// 	XAxis,
// 	YAxis,
// 	CartesianGrid,
// 	Tooltip,
// 	ResponsiveContainer,
// } from "recharts";
// import axios from "axios";

// function Expense() {
// 	const [showExpenseModal, setShowExpenseModal] = useState(false);

// 	const [filterRange, setFilterRange] = useState("all"); // all | 7 | 30 | 365 | custom
// 	const [customFromDate, setCustomFromDate] = useState("");
// 	const [customToDate, setCustomToDate] = useState("");

// 	const onClose = () => {
// 		setShowExpenseModal(false);
// 	};

// 	// Build query string based on filter
// 	const buildQueryParams = () => {
// 		let params = `?range=${filterRange}`;
// 		if (filterRange === "custom") {
// 			if (customFromDate) params += `&from=${customFromDate}`;
// 			if (customToDate) params += `&to=${customToDate}`;
// 		}
// 		return params;
// 	};

// 	const { data, isLoading, isError, error, refetch } = useQuery({
// 		queryKey: [
// 			"expenseTransactions",
// 			filterRange,
// 			customFromDate,
// 			customToDate,
// 		],
// 		queryFn: async () => {
// 			const res = await axios.get(
// 				`${import.meta.env.VITE_BASE_URL}/transaction/expense${buildQueryParams()}`,
// 				{ withCredentials: true }
// 			);
// 			return res.data.transactions;
// 		},
// 	});

// 	// If user changes filter, automatically refetch
// 	useEffect(() => {
// 		refetch();
// 	}, [filterRange, customFromDate, customToDate, refetch]);

// 	// Prepare chart data
// 	const chartData = data
// 		? [...data]
// 				.sort((a, b) => new Date(a.date) - new Date(b.date))
// 				.map((tx) => ({
// 					date: tx.date.slice(0, 10),
// 					amount: tx.amount,
// 				}))
// 		: [];
// 	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

// 	return (
// 		<div className="overflow-x-hidden bg-gray-50 min-h-screen">
// 			<TitleBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
// 			<Sidebar
// 				isOpen={isSidebarOpen}
// 				toggleSidebar={() => setIsSidebarOpen(false)}
// 			/>

// 			{showExpenseModal && <ExpenseModal onClose={onClose} />}

// 			<div className="min-h-screen bg-gray-50 pt-16 pl-16 lg:pl-64 transition-all duration-300">

// 				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
// 					{isLoading && <p>Loading transactions...</p>}
// 					{isError && <p className="text-red-500">Error: {error.message}</p>}

// 					{/* Filter Controls */}
// 					<div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 mb-6 items-start sm:items-end">
// 						<div>
// 							<label className="block text-sm font-medium text-gray-800 mb-1">
// 								Date Range
// 							</label>
// 							<select
// 								value={filterRange}
// 								onChange={(e) => setFilterRange(e.target.value)}
// 								className="block w-44 px-2 py-1 border rounded text-sm"
// 							>
// 								<option value="all">All</option>
// 								<option value="7">Last 7 Days</option>
// 								<option value="30">Last 30 Days</option>
// 								<option value="365">Last Year</option>
// 								<option value="custom">Custom Range</option>
// 							</select>
// 						</div>

// 						{/* Custom Date Range */}
// 						{filterRange === "custom" && (
// 							<>
// 								<div>
// 									<label className="block text-sm font-medium text-gray-800 mb-1">
// 										From
// 									</label>
// 									<input
// 										type="date"
// 										value={customFromDate}
// 										onChange={(e) => setCustomFromDate(e.target.value)}
// 										className="block w-44 px-2 py-1 border rounded text-sm"
// 									/>
// 								</div>
// 								<div>
// 									<label className="block text-sm font-medium text-gray-800 mb-1">
// 										To
// 									</label>
// 									<input
// 										type="date"
// 										value={customToDate}
// 										onChange={(e) => setCustomToDate(e.target.value)}
// 										className="block w-44 px-2 py-1 border rounded text-sm"
// 									/>
// 								</div>
// 							</>
// 						)}
// 					</div>

// 					{/* Chart */}
// 					{chartData.length > 0 && (
// 						<div className="bg-white p-4 rounded-lg shadow mb-6">
// 							<h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
// 								Expense Overview
// 							</h3>
// 							<p className="text-sm text-gray-500 mb-6">
// 								Track your spending over time and analyze your expense trends.
// 							</p>
// 							<ResponsiveContainer width="100%" height={300}>
// 								<LineChart data={chartData}>
// 									<CartesianGrid strokeDasharray="3 3" />
// 									<XAxis dataKey="date" />
// 									<YAxis />
// 									<Tooltip />
// 									<Line
// 										type="monotone"
// 										dataKey="amount"
// 										stroke="#ef4444"
// 										strokeWidth={2}
// 									/>
// 								</LineChart>
// 							</ResponsiveContainer>
// 						</div>
// 					)}

// 					{/* Add Expense + Table Title */}
// 					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
// 						<h2 className="text-xl sm:text-2xl font-bold text-gray-800">
// 							Expense Items
// 						</h2>
// 						<button
// 							onClick={() => setShowExpenseModal(true)}
// 							className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow transition"
// 						>
// 							+ Add Expense
// 						</button>
// 					</div>

// 					{/* Table with horizontal scroll on small screens */}
// 					<div className="overflow-x-auto">
// 						{!isLoading && !isError && (
// 							<Table transactions={data} queryKey="expenseTransactions" />
// 						)}
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

// export default Expense;


import { useState, useEffect } from "react";
import ExpenseModal from "../Modals/ExpenseModal";
import TitleBar from "../Components/TitleBar";
import Sidebar from "../Components/Sidebar";
import Table from "../Components/Table";
import { useQuery } from "@tanstack/react-query";
import { ReceiptText } from "lucide-react"; // Imported for the empty state
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import axios from "axios";

function Expense() {
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [filterRange, setFilterRange] = useState("all"); // all | 7 | 30 | 365 | custom
    const [customFromDate, setCustomFromDate] = useState("");
    const [customToDate, setCustomToDate] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const onClose = () => {
        setShowExpenseModal(false);
    };

    // Build query string based on filter
    const buildQueryParams = () => {
        let params = `?range=${filterRange}`;
        if (filterRange === "custom") {
            if (customFromDate) params += `&from=${customFromDate}`;
            if (customToDate) params += `&to=${customToDate}`;
        }
        return params;
    };

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: [
            "expenseTransactions",
            filterRange,
            customFromDate,
            customToDate,
        ],
        queryFn: async () => {
            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/transaction/expense${buildQueryParams()}`,
                { withCredentials: true }
            );
            return res.data.transactions;
        },
    });

    // If user changes filter, automatically refetch
    useEffect(() => {
        refetch();
    }, [filterRange, customFromDate, customToDate, refetch]);

    // Prepare chart data
    // const chartData = data
    //     ? [...data]
    //             .sort((a, b) => new Date(a.date) - new Date(b.date))
    //             .map((tx) => ({
    //                 date: tx.date.slice(0, 10),
    //                 amount: tx.amount,
    //             }))
    //     : [];
	const chartData = data
     ? [...data]
             .sort((a, b) => new Date(a.date) - new Date(b.date))
             .map((tx) => ({
                 date: tx.date.slice(0, 10),
                 amount: tx.amount,
                 title: tx.title || tx.name, // <--- Add this line
             }))
     : [];

    return (
        <div className="overflow-x-hidden bg-gray-50 min-h-screen">
            <TitleBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={() => setIsSidebarOpen(false)}
            />

            {showExpenseModal && <ExpenseModal onClose={onClose} />}

            <div className="min-h-screen bg-gray-50 pt-16 pl-16 lg:pl-64 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    
                    {/* Error State */}
                    {isError && (
                        <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-lg">
                            Error: {error.message}
                        </div>
                    )}

                    {/* Filter Controls */}
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 mb-6 items-start sm:items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-800 mb-1">
                                Date Range
                            </label>
                            <select
                                value={filterRange}
                                onChange={(e) => setFilterRange(e.target.value)}
                                className="block w-44 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            >
                                <option value="all">All</option>
                                <option value="7">Last 7 Days</option>
                                <option value="30">Last 30 Days</option>
                                <option value="365">Last Year</option>
                                <option value="custom">Custom Range</option>
                            </select>
                        </div>

                        {/* Custom Date Range */}
                        {filterRange === "custom" && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-800 mb-1">
                                        From
                                    </label>
                                    <input
                                        type="date"
                                        value={customFromDate}
                                        onChange={(e) => setCustomFromDate(e.target.value)}
                                        className="block w-44 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-800 mb-1">
                                        To
                                    </label>
                                    <input
                                        type="date"
                                        value={customToDate}
                                        onChange={(e) => setCustomToDate(e.target.value)}
                                        className="block w-44 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* HCI Loading State (Skeleton) */}
                    {isLoading && (
                        <div className="bg-white p-6 rounded-xl shadow-sm mb-6 animate-pulse">
                            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                            <div className="h-64 bg-gray-100 rounded-lg w-full"></div>
                        </div>
                    )}

                    {/* Chart Data Render */}
                    {!isLoading && chartData.length > 0 && (
                        <div className="bg-white p-6 rounded-xl shadow-sm mb-6 border border-gray-100">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
                                Expense Overview
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Track your spending over time and analyze your expense trends.
                            </p>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis 
                                        dataKey="date" 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tick={{ fill: '#6b7280', fontSize: 12 }} 
                                        dy={10}
                                    />
                                    <YAxis 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tick={{ fill: '#6b7280', fontSize: 12 }}
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    {/* <Tooltip 
                                        cursor={{ fill: '#f3f4f6' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value) => [`$${value}`, 'Amount']}
                                    /> */}
									<Tooltip cursor={{ fill: '#f3f4f6' }} content={<CustomTooltip />} />
                                    <Bar
                                        dataKey="amount"
                                        fill="#ef4444"
                                        radius={[4, 4, 0, 0]}
                                        maxBarSize={50}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* HCI Empty State (No Data Found) */}
                    {!isLoading && chartData.length === 0 && !isError && (
                        <div className="flex flex-col items-center justify-center p-12 mb-6 text-center bg-white border-2 border-dashed border-gray-200 rounded-xl">
                            <ReceiptText className="w-12 h-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900">No expenses found</h3>
                            <p className="mt-1 text-sm text-gray-500 mb-6 max-w-sm">
                                We couldn't find any transactions for this date range.
                            </p>
                            <button
                                onClick={() => setShowExpenseModal(true)}
                                className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition shadow-sm"
                            >
                                + Add Your First Expense
                            </button>
                        </div>
                    )}

                    {/* Table Header Section */}
                    {chartData.length > 0 && (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4 mt-8">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                                Expense Items
                            </h2>
                            <button
                                onClick={() => setShowExpenseModal(true)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow-sm transition"
                            >
                                + Add Expense
                            </button>
                        </div>
                    )}

                    {/* Table Render */}
                    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
                        {!isLoading && !isError && chartData.length > 0 && (
                            <Table transactions={data} queryKey="expenseTransactions" />
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Expense;