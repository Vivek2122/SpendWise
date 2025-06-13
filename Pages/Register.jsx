import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		password: "",
	});

	const navigate = useNavigate();

	function handleChange(e) {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	}

	const handleSubmit = async function (e) {
		e.preventDefault();
		try {
			const res = await axios.post("https://cointraq.onrender.com/", formData, {
				withCredentials: true,
			});
			if (res.status === 201) {
				toast.success("Registered successfully.");
				navigate("/login");
			}
		} catch (err) {
			console.log(`error: ${err}`);
			toast.error("Registration failed.");
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

	const handleGoogleRegister = () => {
		window.open("https://cointraq.onrender.com/auth/google", "_self");
	};

	return (
		<div className="flex flex-col lg:flex-row h-screen w-full overflow-auto">
			{/* Form Section */}
			<div className="w-full lg:w-1/2 flex items-center justify-center py-16 px-6 sm:px-12 md:px-20 lg:px-24 xl:px-32">
				<div className="w-full max-w-md">
					<h3 className="text-3xl font-extrabold text-indigo-600 mb-6 mt-4">
						CoinTraq
					</h3>
					<h2 className="text-2xl font-semibold text-gray-800 mb-2">
						Create an Account
					</h2>
					<p className="text-sm text-gray-600 mb-6">
						Join us today by entering your details below.
					</p>

					<form onSubmit={handleSubmit} className="space-y-5">
						<div>
							<label
								htmlFor="fullName"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Full Name
							</label>
							<input
								type="text"
								id="fullName"
								name="fullName"
								value={formData.fullName}
								onChange={handleChange}
								placeholder="John Doe"
								required
								className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
						</div>

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
								className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
								className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
						</div>

						<button
							type="submit"
							className="w-full bg-indigo-600 text-white font-semibold py-2 mb-2 rounded-lg hover:bg-indigo-700 transition duration-300"
						>
							SIGN UP
						</button>

						<div className="flex items-center gap-4 mb-2">
							<div className="h-px bg-gray-300 flex-1" />
							<span className="text-sm text-gray-500">OR</span>
							<div className="h-px bg-gray-300 flex-1" />
						</div>

						{/* Google Auth Button */}
						<button
							type="button"
							onClick={handleGoogleRegister}
							aria-label="Continue with Google"
							className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
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
					</form>
					<p className="text-sm text-gray-600 text-center mt-2 pb-2">
						Already have an account?{" "}
						<Link to="/login" className="text-indigo-600 hover:underline">
							Login
						</Link>
					</p>
				</div>
			</div>

			{/* Image Section */}
			<div className="hidden lg:block w-1/2 h-full">
				<img
					src="/images/bg.jpg"
					alt="Background"
					className="w-full h-full object-cover"
				/>
			</div>
		</div>
	);
}

export default Register;
