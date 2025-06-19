import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Logout() {
	const navigate = useNavigate();
	const [showSuccess, setShowSuccess] = useState(false);

	useEffect(() => {
		const logoutUser = async () => {
			try {
				await axios.post(
					`${import.meta.env.VITE_BASE_URL}/logout`,
					{},
					{ withCredentials: true }
				);

				// Show success message
				setShowSuccess(true);

				// Wait 1.5 sec, then navigate to login
				setTimeout(() => {
					navigate("/login");
					toast.info("Logged out successfully.");
				}, 1500);
			} catch (err) {
				console.error("Logout failed:", err);

				// Even if error, navigate to login after fallback
				navigate("/login");
			}
		};

		logoutUser();
	}, [navigate]);

	return (
		<div className="flex items-center justify-center h-screen bg-gray-50">
			<div className="text-center">
				{showSuccess ? (
					<>
						<p className="text-xl font-semibold text-green-600 mb-2">
							You’ve been logged out successfully!
						</p>
						<p className="text-sm text-gray-500">Redirecting to login...</p>
					</>
				) : (
					<>
						<p className="text-lg text-gray-700 mb-2">Logging you out...</p>
						<div className="w-8 h-8 border-4 border-indigo-500 border-dashed rounded-full animate-spin mx-auto"></div>
					</>
				)}
			</div>
		</div>
	);
}

export default Logout;
