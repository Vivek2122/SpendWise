// import {
// 	BarChart,
// 	Bar,
// 	XAxis,
// 	YAxis,
// 	Tooltip,
// 	ResponsiveContainer,
// } from "recharts";

// function PlotBarChart({ transactions, barColor }) {
// 	// Filter for last 30 days
// 	const now = new Date();
// 	const last30Days = new Date(now);
// 	last30Days.setDate(now.getDate() - 29);

// 	const filteredTransactions = transactions.filter(
// 		(tx) => new Date(tx.date) >= last30Days
// 	);

// 	// Group by date and sum amounts
// 	const dailyTotals = {};

// 	filteredTransactions.forEach((tx) => {
// 		const date = new Date(tx.date);
// 		// Format date as YYYY-MM-DD (UTC safe)
// 		const formattedDate = `${date.getUTCFullYear()}-${String(
// 			date.getUTCMonth() + 1
// 		).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;

// 		if (!dailyTotals[formattedDate]) {
// 			dailyTotals[formattedDate] = 0;
// 		}
// 		dailyTotals[formattedDate] += tx.amount;
// 	});

// 	// Convert to sorted array for Recharts
// 	const chartData = Object.keys(dailyTotals)
// 		.sort() // ascending by date
// 		.map((date) => ({
// 			date,
// 			amount: dailyTotals[date],
// 		}));

// 	return (
// 		<ResponsiveContainer width="100%" height={300}>
// 			<BarChart data={chartData}>
// 				<XAxis dataKey="date" tick={false} />
// 				<YAxis tick={{ fontSize: 12 }} />
// 				<Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
// 				<Bar dataKey="amount" fill={barColor} />
// 			</BarChart>
// 		</ResponsiveContainer>
// 	);
// }

// export default PlotBarChart;


import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

// 1. The Custom Tooltip for Grouped Data
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const barColor = payload[0].fill; 
        
        return (
            <div className="bg-white p-3 border border-gray-100 rounded-lg shadow-lg">
                <p className="font-bold text-gray-800 mb-1">{label}</p>
                {/* This will list out all the sources that make up this specific bar */}
                <p className="text-xs text-gray-500 mb-2 max-w-[200px] break-words">
                    {payload[0].payload.sources}
                </p>
                <p className="text-sm font-semibold" style={{ color: barColor }}>
                    ${payload[0].value.toFixed(2)}
                </p>
            </div>
        );
    }
    return null;
};

function PlotBarChart({ transactions, barColor }) {
    // Filter for last 30 days
    const now = new Date();
    const last30Days = new Date(now);
    last30Days.setDate(now.getDate() - 29);

    const filteredTransactions = transactions.filter(
        (tx) => new Date(tx.date) >= last30Days
    );

    // 2. Your Grouping Logic (Upgraded to capture sources)
    const dailyData = {};

    filteredTransactions.forEach((tx) => {
        const date = new Date(tx.date);
        const formattedDate = `${date.getUTCFullYear()}-${String(
            date.getUTCMonth() + 1
        ).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;

        if (!dailyData[formattedDate]) {
            // Create an object holding both the amount and a Set for unique sources
            dailyData[formattedDate] = { amount: 0, sources: new Set() };
        }
        
        dailyData[formattedDate].amount += tx.amount;
        dailyData[formattedDate].sources.add(tx.source); // Add the source to the list
    });

    // Convert to sorted array for Recharts
    const chartData = Object.keys(dailyData)
        .sort() // ascending by date
        .map((date) => ({
            date,
            amount: dailyData[date].amount,
            // Convert the Set of sources into a comma-separated string (e.g., "Salary, Bonus")
            sources: Array.from(dailyData[date].sources).join(", "),
        }));

    // 3. HCI Empty State
    if (chartData.length === 0) {
        return (
            <div className="flex items-center justify-center h-full min-h-[250px] text-gray-400 text-sm italic mt-4 border-2 border-dashed border-gray-100 rounded-lg">
                No transactions in the last 30 days.
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={280} className="mt-4">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                {/* Clean, modern grid lines */}
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                
                {/* We can hide the X-Axis ticks entirely for a cleaner look since the tooltip shows the date */}
                <XAxis dataKey="date" tick={false} axisLine={false} tickLine={false} />
                
                <YAxis 
                    tick={{ fontSize: 12, fill: '#6b7280' }} 
                    axisLine={false} 
                    tickLine={false}
                    tickFormatter={(value) => `$${value}`}
                />
                
                {/* Using the new custom tooltip */}
                <Tooltip cursor={{ fill: '#f3f4f6' }} content={<CustomTooltip />} />
                
                {/* Rounded bars to match the rest of the dashboard */}
                <Bar 
                    dataKey="amount" 
                    fill={barColor} 
                    radius={[4, 4, 0, 0]}
                    maxBarSize={50}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default PlotBarChart;