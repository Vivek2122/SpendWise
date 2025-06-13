import { useState } from "react";
import axios from "axios";
import DeleteModal from "../Modals/DeleteModal";
import EditModal from "../Modals/EditModal";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { FilePenLine, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

function CustomTable({ transactions, queryKey }) {
	const queryClient = useQueryClient();
	const [deleteId, setDeleteId] = useState(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [editTransaction, setEditTransaction] = useState(null);

	const deleteMutation = useMutation({
		mutationFn: async (id) => {
			const res = await axios.delete(
				`${import.meta.env.VITE_BASE_URL}/transaction/delete/${id}`,
				{ withCredentials: true }
			);
			return res.data.msg;
		},
		onSuccess: () => queryClient.invalidateQueries(queryKey),
		onError: (err) => {
			console.error("Error:", err.message);
			toast.error("Failed to delete transaction.");
		},
	});

	const handleDeleteClick = (id) => {
		setDeleteId(id);
		setShowDeleteModal(true);
	};

	const handleConfirmDelete = () => {
		deleteMutation.mutate(deleteId);
		setShowDeleteModal(false);
		setDeleteId(null);
		toast.success("Transaction deleted.");
	};

	const handleEditClick = (transaction) => {
		setEditTransaction(transaction);
		setShowEditModal(true);
	};

	return (
		<>
			<div className="p-4 sm:p-6">
				<div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 max-w-full">
					<table className="min-w-full text-sm divide-y divide-gray-200">
						<thead className="bg-indigo-50">
							<tr>
								{["Source", "Amount", "Date", "Actions"].map((heading) => (
									<th
										key={heading}
										scope="col"
										className="px-4 py-3 text-left font-semibold text-indigo-700 uppercase tracking-wide whitespace-nowrap"
									>
										{heading}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 bg-white">
							{!transactions || transactions.length === 0 ? (
								<tr>
									<td
										colSpan="4"
										className="px-6 py-8 text-center text-gray-400 italic"
									>
										No transactions found.
									</td>
								</tr>
							) : (
								transactions.map((tx) => (
									<tr
										key={tx._id}
										className="hover:bg-indigo-50 transition-colors"
									>
										<td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900 max-w-[200px] truncate">
											{tx.source}
										</td>
										<td className="px-4 py-3 whitespace-nowrap text-indigo-600 font-semibold">
											${tx.amount.toFixed(2)}
										</td>
										<td className="px-4 py-3 whitespace-nowrap text-gray-500 xs:table-cell">
											{tx.date.slice(0, 10)}
										</td>
										<td className="px-4 py-3 whitespace-nowrap">
											<div className="flex flex-wrap gap-2 sm:gap-3">
												<button
													onClick={() => handleEditClick(tx)}
													className="text-indigo-600 hover:text-indigo-800 transition rounded p-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
													aria-label="Edit Transaction"
													title="Edit"
												>
													<FilePenLine size={20} />
												</button>

												<button
													onClick={() => handleDeleteClick(tx._id)}
													disabled={deleteMutation.isLoading}
													className={`flex items-center justify-center transition rounded-full focus:outline-none focus:ring-2 focus:ring-red-400
													${
														deleteMutation.isLoading
															? "opacity-50 cursor-not-allowed"
															: "bg-red-500 hover:bg-red-700"
													}
													w-9 h-9 sm:w-10 sm:h-10
												`}
													title="Delete"
													aria-label="Delete Transaction"
												>
													<Trash2 size={18} className="text-white" />
												</button>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			{showDeleteModal && (
				<DeleteModal
					onClose={() => setShowDeleteModal(false)}
					onConfirm={handleConfirmDelete}
				/>
			)}

			{showEditModal && (
				<EditModal
					onClose={() => setShowEditModal(false)}
					transaction={editTransaction}
					queryKey={queryKey}
				/>
			)}
		</>
	);
}

export default CustomTable;
