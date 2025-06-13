import { useState, useEffect } from "react";
import IncomeModal from "../Modals/IncomeModal";
import TitleBar from "../Components/TitleBar";
import Sidebar from "../Components/Sidebar";
import Table from "../Components/Table";
import { useQuery } from "@tanstack/react-query";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import axios from "axios";

function Income() {
	const [showIncomeModal, setShowIncomeModal] = useState(false);
	const [filterRange, setFilterRange] = useState("all");
	const [customFromDate, setCustomFromDate] = useState("");
	const [customToDate, setCustomToDate] = useState("");

	const onClose = () => {
		setShowIncomeModal(false);
	};

	const buildQueryParams = () => {
		let params = `?range=${filterRange}`;
		if (filterRange === "custom") {
			if (customFromDate) params += `&from=${customFromDate}`;
			if (customToDate) params += `&to=${customToDate}`;
		}
		return params;
	};

	const { data, isLoading, isError, error, refetch } = useQuery({
		queryKey: ["incomeTransactions", filterRange, customFromDate, customToDate],
		queryFn: async () => {
			const res = await axios.get(
				`https://cointraq.onrender.com/transaction/income${buildQueryParams()}`,
				{ withCredentials: true }
			);
			return res.data.transactions;
		},
	});

	useEffect(() => {
		refetch();
	}, [filterRange, customFromDate, customToDate, refetch]);

	const chartData = data
		? [...data]
				.sort((a, b) => new Date(a.date) - new Date(b.date))
				.map((tx) => ({
					date: tx.date.slice(0, 10),
					amount: tx.amount,
				}))
		: [];
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	return (
		<div className="overflow-x-hidden bg-gray-50 min-h-screen">
			<TitleBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
			<Sidebar
				isOpen={isSidebarOpen}
				toggleSidebar={() => setIsSidebarOpen(false)}
			/>
			{showIncomeModal && <IncomeModal onClose={onClose} />}

			<div className="min-h-screen bg-gray-50 pt-16 pl-16 lg:pl-64 transition-all duration-300">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					{isLoading && <p>Loading transactions...</p>}
					{isError && <p className="text-red-500">Error: {error.message}</p>}

					{/* Filter Controls */}
					<div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 mb-6 items-start sm:items-end">
						<div>
							<label className="block text-sm font-medium text-gray-800 mb-1">
								Date Range
							</label>
							<select
								value={filterRange}
								onChange={(e) => setFilterRange(e.target.value)}
								className="block w-44 px-2 py-1 border rounded text-sm"
							>
								<option value="all">All</option>
								<option value="7">Last 7 Days</option>
								<option value="30">Last 30 Days</option>
								<option value="365">Last Year</option>
								<option value="custom">Custom Range</option>
							</select>
						</div>
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
										className="block w-44 px-2 py-1 border rounded text-sm"
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
										className="block w-44 px-2 py-1 border rounded text-sm"
									/>
								</div>
							</>
						)}
					</div>

					{/* Chart */}
					{chartData.length > 0 && (
						<div className="bg-white p-4 rounded-lg shadow mb-6">
							<h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
								Income Overview
							</h3>
							<p className="text-sm text-gray-500 mb-6">
								Track your earnings over time and analyze your income trends.
							</p>
							<ResponsiveContainer width="100%" height={300}>
								<LineChart data={chartData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="date" />
									<YAxis />
									<Tooltip />
									<Line
										type="monotone"
										dataKey="amount"
										stroke="#4f46e5"
										strokeWidth={2}
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
					)}

					{/* Add Income + Table */}
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
						<h2 className="text-xl sm:text-2xl font-bold text-gray-800">
							Income Sources
						</h2>
						<button
							onClick={() => setShowIncomeModal(true)}
							className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow transition"
						>
							+ Add Income
						</button>
					</div>

					<div className="overflow-x-auto">
						{!isLoading && !isError && (
							<Table transactions={data} queryKey="incomeTransactions" />
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Income;
