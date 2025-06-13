import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	function handleChange(e) {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	}

	const handleSubmit = async function (e) {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await axios.post("https://cointraq.onrender.com/login", formData, {
				withCredentials: true,
			});
			if (res.status === 200) {
				toast.success("Logged in successfully.");
				navigate("/dashboard");
			}
		} catch (err) {
			if (err.response?.status === 400) {
				toast.error("Incorrect username or password.");
			} else {
				toast.error("Something went wrong. Please try again.");
				console.log(`Login error: ${err}`);
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const res = await axios.get("https://cointraq.onrender.com/authStatus", {
					withCredentials: true,
				});
				if (res.status === 200) {
					toast.info("Already logged in.");
					navigate("/dashboard");
				}
			} catch (err) {
				console.log(
					"Not authenticated:",
					err.response?.data?.msg || err.message
				);
			}
		};
		checkAuth();
	}, [navigate]);

	const handleGoogleLogin = () => {
		window.open("https://cointraq.onrender.com/auth/google", "_self");
	};

	return (
		<div className="flex flex-col lg:flex-row h-screen overflow-auto">
			{/* Form Section */}
			<div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-32 py-12 sm:py-16">
				<h3 className="text-3xl sm:text-4xl font-extrabold text-indigo-600 mb-6">
					CoinTraq
				</h3>
				<h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
					Welcome Back
				</h2>
				<h4 className="text-sm text-gray-600 mb-6">
					Please enter your details to log in
				</h4>

				<form
					onSubmit={handleSubmit}
					className="space-y-6 max-w-md w-full mx-auto"
				>
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Email Address
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							placeholder="john@example.com"
							required
							className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Password
						</label>
						<input
							type="password"
							id="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							placeholder="Minimum 8 Characters"
							minLength={8}
							required
							className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className={`w-full font-semibold text-sm sm:text-base py-3 px-4 min-h-[44px] rounded-lg transition duration-300 ${
							loading
								? "bg-indigo-300 cursor-not-allowed"
								: "bg-indigo-600 text-white hover:bg-indigo-700"
						}`}
					>
						{loading ? "Logging in..." : "LOGIN"}
					</button>

					<div className="flex items-center gap-4">
						<div className="h-px bg-gray-300 flex-1" />
						<span className="text-sm text-gray-500">OR</span>
						<div className="h-px bg-gray-300 flex-1" />
					</div>

					<button
						type="button"
						onClick={handleGoogleLogin}
						aria-label="Continue with Google"
						className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 px-4 min-h-[44px] rounded-lg hover:bg-gray-100 transition"
					>
						<img
							src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
							alt="Google"
							className="w-5 h-5"
						/>
						<span className="text-sm text-gray-700 font-medium">
							Continue with Google
						</span>
					</button>

					<p className="text-sm text-gray-600 text-center">
						Don&apos;t have an account?{" "}
						<Link to="/" className="text-indigo-600 hover:underline">
							Sign Up
						</Link>
					</p>
				</form>
			</div>

			{/* Image Section */}
			<div className="hidden sm:block w-full sm:w-1/3 lg:w-1/2 h-48 sm:h-full">
				<img
					src="/images/bg.jpg"
					alt="Background"
					className="w-full h-full object-cover"
				/>
			</div>
		</div>
	);
}

export default Login;
