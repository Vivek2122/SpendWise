import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

function PlotBarChart({ transactions, barColor }) {
	// Filter for last 30 days
	const now = new Date();
	const last30Days = new Date(now);
	last30Days.setDate(now.getDate() - 29);

	const filteredTransactions = transactions.filter(
		(tx) => new Date(tx.date) >= last30Days
	);

	// Group by date and sum amounts
	const dailyTotals = {};

	filteredTransactions.forEach((tx) => {
		const date = new Date(tx.date);
		// Format date as YYYY-MM-DD (UTC safe)
		const formattedDate = `${date.getUTCFullYear()}-${String(
			date.getUTCMonth() + 1
		).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;

		if (!dailyTotals[formattedDate]) {
			dailyTotals[formattedDate] = 0;
		}
		dailyTotals[formattedDate] += tx.amount;
	});

	// Convert to sorted array for Recharts
	const chartData = Object.keys(dailyTotals)
		.sort() // ascending by date
		.map((date) => ({
			date,
			amount: dailyTotals[date],
		}));

	return (
		<ResponsiveContainer width="100%" height={300}>
			<BarChart data={chartData}>
				<XAxis dataKey="date" tick={false} />
				<YAxis tick={{ fontSize: 12 }} />
				<Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
				<Bar dataKey="amount" fill={barColor} />
			</BarChart>
		</ResponsiveContainer>
	);
}

export default PlotBarChart;
