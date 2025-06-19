import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
	LayoutDashboard,
	BanknoteArrowUp,
	BanknoteArrowDown,
	LogOut,
} from "lucide-react";

function Sidebar() {
	const navigate = useNavigate();
	const location = useLocation();
	const [user, setUser] = useState({});
	const [isChecked, setIsChecked] = useState(false);

	useEffect(() => {
		const getUserInfo = async () => {
			try {
				const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/getUser`, {
					withCredentials: true,
				});
				setUser(res.data.user);
				setIsChecked(true);
			} catch (err) {
				if (err?.response?.status === 401) {
					navigate("/login");
				}
			}
		};

		getUserInfo();
	}, [navigate]);

	if (!isChecked) {
		return (
			<div className="p-4 text-center text-gray-500">Loading Sidebar...</div>
		);
	}

	return (
		<aside className="fixed top-16 left-0 bottom-0 w-16 lg:w-64 bg-white border-r border-gray-200 p-3 lg:p-6 shadow-md overflow-auto z-20 transition-all duration-300">
			{/* Title - Only on large screens */}
			<div className="mb-6 text-center hidden lg:block">
				<p className="text-base text-gray-900 font-extrabold truncate">
					{user.name}
				</p>
			</div>

			{/* Navigation */}
			<nav className="flex flex-col gap-2">
				<NavItem
					icon={<LayoutDashboard size={20} />}
					label="Dashboard"
					path="/dashboard"
					currentPath={location.pathname}
				/>
				<NavItem
					icon={<BanknoteArrowUp size={20} />}
					label="Income"
					path="/transaction/income"
					currentPath={location.pathname}
				/>
				<NavItem
					icon={<BanknoteArrowDown size={20} />}
					label="Expense"
					path="/transaction/expense"
					currentPath={location.pathname}
				/>
				<NavItem
					icon={<LogOut size={20} />}
					label="Logout"
					path="/logout"
					currentPath={location.pathname}
				/>
			</nav>
		</aside>
	);
}

function NavItem({ icon, label, path, currentPath }) {
	const isActive = currentPath === path;

	return (
		<Link
			to={path}
			className={`flex items-center lg:justify-start justify-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
				isActive
					? "bg-indigo-100 text-indigo-600"
					: "text-gray-800 hover:bg-gray-100 hover:text-indigo-600"
			}`}
		>
			{icon}
			{/* Label is hidden on smaller screens */}
			<span className="hidden lg:inline">{label}</span>
		</Link>
	);
}

export default Sidebar;
