import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { X } from "lucide-react";
import { toast } from "react-toastify";

function IncomeModal({ onClose }) {
	const [formData, setFormData] = useState({
		source: "",
		amount: "",
		date: "",
	});

	const queryClient = useQueryClient();

	const addIncomeMutation = useMutation({
		mutationFn: async (formData) => {
			await axios.post(`${import.meta.env.VITE_BASE_URL}/transaction/income`, formData, {
				withCredentials: true,
			});
		},
		onSuccess: () => queryClient.invalidateQueries(["incomeTransactions"]),
		onError: (err) => {
			console.log("Error: ", err.message);
			toast.error("Failed to add transaction.");
		},
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		addIncomeMutation.mutate(formData);
		onClose();
		toast.success("Transaction added!");
	};

	const handleChange = (e) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	return (
		<div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
			<div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fade-in">
				{/* Modal Header */}
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-bold text-gray-800">Add Income</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-red-500 transition cursor-pointer"
					>
						<X size={20} />
					</button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-5">
					<div>
						<label
							htmlFor="source"
							className="block text-sm font-medium text-gray-700"
						>
							Income Source
						</label>
						<input
							type="text"
							id="source"
							name="source"
							value={formData.source}
							onChange={handleChange}
							required
							className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
							placeholder="e.g. Salary"
						/>
					</div>

					<div>
						<label
							htmlFor="amount"
							className="block text-sm font-medium text-gray-700"
						>
							Amount
						</label>
						<input
							type="number"
							id="amount"
							name="amount"
							value={formData.amount}
							onChange={handleChange}
							required
							className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
							placeholder="e.g. 7000"
						/>
					</div>

					<div>
						<label
							htmlFor="date"
							className="block text-sm font-medium text-gray-700"
						>
							Date
						</label>
						<input
							type="date"
							id="date"
							name="date"
							value={formData.date}
							onChange={handleChange}
							required
							className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
					</div>

					<button
						type="submit"
						disabled={addIncomeMutation.isLoading}
						className={`w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold cursor-pointer transition 
    					${
								addIncomeMutation.isLoading
									? "opacity-50 cursor-not-allowed"
									: "hover:bg-indigo-700"
							}
  						`}
					>
						{addIncomeMutation.isLoading ? "Adding..." : "Add Income"}
					</button>
				</form>
			</div>
		</div>
	);
}

export default IncomeModal;
