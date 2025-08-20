// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import { message, Modal } from "antd";

// function Expensive() {
//   const [expenses, setExpenses] = useState([]);
//   const [editingId, setEditingId] = useState(null);

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     amount: "",
//     date: "",
//   });

//   useEffect(() => {
//     fetchExpenses();
//   }, []);

//   const fetchExpenses = async () => {
//     try {
//       const res = await axios.get(
//         "https://expensive-bend.onrender.com/api/expenses"
//       );
//       setExpenses(res.data);
//     } catch (err) {
//       message.error("Failed to fetch expenses.");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.title || !form.amount) return;

//     try {
//       await axios.post("https://expensive-bend.onrender.com/api/expenses", {
//         title: form.title,
//         description: form.description,
//         amount: parseFloat(form.amount),
//         date: form.date,
//       });

//       message.success("Expense added successfully!");
//       setForm({ title: "", description: "", amount: "", date: "" });
//       fetchExpenses();
//     } catch (err) {
//       message.error("Failed to add expense.");
//     }
//   };

//   const handleDelete = async (id) => {
//     Modal.confirm({
//       title: "Are you sure?",
//       content: "Do you really want to delete this expense?",
//       okText: "Yes, delete it",
//       okType: "danger",
//       cancelText: "Cancel",
//       onOk: async () => {
//         try {
//           await axios.delete(
//             `https://expensive-bend.onrender.com/api/expenses/${id}`
//           );
//           message.success("Expense deleted successfully!");
//           fetchExpenses();
//         } catch (error) {
//           message.error("Failed to delete expense.");
//         }
//       },
//     });
//   };

//   const handleEdit = (exp) => {
//     setForm({
//       title: exp.title,
//       description: exp.description,
//       amount: exp.amount,
//       date: new Date(exp.date).toISOString().split("T")[0],
//     });
//     setEditingId(exp._id);
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     if (!form.title || !form.amount) return;

//     try {
//       await axios.patch(
//         `https://expensive-bend.onrender.com/api/expenses/${editingId}`,
//         {
//           title: form.title,
//           description: form.description,
//           amount: parseFloat(form.amount),
//           date: form.date,
//         }
//       );

//       message.success("Expense updated successfully!");
//       setForm({ title: "", description: "", amount: "", date: "" });
//       setEditingId(null);
//       fetchExpenses();
//     } catch (err) {
//       message.error("Failed to update expense.");
//     }
//   };

//   const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-200 via-blue-100 to-blue-300 flex items-center justify-center p-4">
//       <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6">
//         <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-blue-700">
//           Monthly Expense Tracker
//         </h2>

//         <form
//           onSubmit={editingId ? handleUpdate : handleSubmit}
//           className="flex flex-col gap-4 mb-6"
//         >
//           <input
//             type="date"
//             value={form.date}
//             onChange={(e) => setForm({ ...form, date: e.target.value })}
//             className="border p-2 rounded-md text-sm sm:text-base"
//           />

//           <input
//             type="text"
//             placeholder="Expense Title"
//             value={form.title}
//             onChange={(e) => setForm({ ...form, title: e.target.value })}
//             className="border p-2 rounded-md text-sm sm:text-base"
//           />
//           <textarea
//             placeholder="description"
//             value={form.description}
//             onChange={(e) => setForm({ ...form, description: e.target.value })}
//             className="border p-2 rounded-md text-sm sm:text-base"
//           ></textarea>
//           <input
//             type="number"
//             placeholder="Amount"
//             value={form.amount}
//             onChange={(e) => setForm({ ...form, amount: e.target.value })}
//             className="border p-2 rounded-md text-sm sm:text-base"
//           />
//           <button
//             type="submit"
//             className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 text-sm sm:text-base"
//           >
//             {editingId ? "Update Expense" : "Add Expense"}
//           </button>
//         </form>

//         <h3 className="text-lg sm:text-xl font-semibold mb-3">All Expenses</h3>
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm sm:text-base text-left border">
//             <thead className="bg-blue-100 text-blue-800">
//               <tr>
//                 <th className="p-2 border">Date</th>
//                 <th className="p-2 border">Title</th>
//                 <th className="p-2 border">Description</th>
//                 <th className="p-2 border">Amount (₹)</th>
//                 <th className="p-2 border text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {expenses.map((exp) => (
//                 <tr key={exp._id} className="border-b hover:bg-gray-50">
//                   <td className="p-2 border">
//                     {(() => {
//                       const d = new Date(exp.date);
//                       const day = String(d.getDate()).padStart(2, "0");
//                       const month = String(d.getMonth() + 1).padStart(2, "0");
//                       const year = d.getFullYear();
//                       return `${day}/${month}/${year}`;
//                     })()}
//                   </td>
//                   <td className="p-2 border">{exp.title}</td>
//                   <td className="p-2 border">{exp.description}</td>
//                   <td className="p-2 border font-semibold">₹{exp.amount}</td>
//                   <td className="p-2 border text-center space-x-2">
//                     <button
//                       onClick={() => handleEdit(exp)}
//                       className="text-blue-600 hover:text-blue-800"
//                     >
//                       <FaEdit />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(exp._id)}
//                       className="text-red-600 hover:text-red-800"
//                     >
//                       <FaTrash />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="mt-6 text-right text-lg sm:text-xl font-bold text-blue-800">
//           Total Spent: ₹{total.toFixed(2)}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Expensive;

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaWallet,
  FaCalendarAlt,
  FaFileAlt,
  FaRupeeSign,
} from "react-icons/fa";

function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    amount: "",
    date: "",
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(
        "https://expensive-bend.onrender.com/api/expenses"
      );
      setExpenses(res.data);
    } catch (err) {
      showToast("Failed to fetch expenses", "error");
    }
  };

  const showToast = (message, type) => {
    // Simple toast notification
    const toast = document.createElement("div");
    toast.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg text-white z-50 ${
      type === "error" ? "bg-red-500" : "bg-green-500"
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount) {
      showToast("Please fill in required fields", "error");
      return;
    }

    try {
      if (editingId) {
        await axios.patch(
          `https://expensive-bend.onrender.com/api/expenses/${editingId}`,
          {
            title: form.title,
            description: form.description,
            amount: parseFloat(form.amount),
            date: form.date,
          }
        );
        showToast("Expense updated successfully!", "success");
      } else {
        await axios.post("https://expensive-bend.onrender.com/api/expenses", {
          title: form.title,
          description: form.description,
          amount: parseFloat(form.amount),
          date: form.date,
        });
        showToast("Expense added successfully!", "success");
      }

      resetForm();
      fetchExpenses();
    } catch (err) {
      showToast("Operation failed. Please try again.", "error");
    }
  };

  const resetForm = () => {
    setForm({ title: "", description: "", amount: "", date: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://expensive-bend.onrender.com/api/expenses/${deleteId}`
      );
      showToast("Expense deleted successfully!", "success");
      fetchExpenses();
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      showToast("Failed to delete expense", "error");
    }
  };

  const handleEdit = (exp) => {
    setForm({
      title: exp.title,
      description: exp.description,
      amount: exp.amount,
      date: new Date(exp.date).toISOString().split("T")[0],
    });
    setEditingId(exp._id);
    setShowForm(true);
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 sticky top-0 z-40">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Expense Tracker</h1>
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
            <FaWallet className="text-sm" />
            <span className="text-sm font-semibold">₹{total.toFixed(0)}</span>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-800">
                ₹{total.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm">This Month</p>
              <p className="text-lg font-semibold text-indigo-600">
                {expenses.length} items
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Button */}
      <div className="px-4 mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-2xl font-semibold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          <FaPlus /> Add New Expense
        </button>
      </div>

      {/* Expenses List */}
      <div className="px-4 pb-20">
        {expenses.length === 0 ? (
          <div className="text-center py-12">
            <FaWallet className="text-4xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No expenses yet</p>
            <p className="text-sm text-gray-400">
              Tap the button above to add your first expense
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.map((exp) => (
              <div
                key={exp._id}
                className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800">
                        {exp.title}
                      </h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {formatDate(exp.date)}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        {exp.description}
                      </p>
                    )}
                    <div className="flex items-center gap-1">
                      <FaRupeeSign className="text-green-600 text-sm" />
                      <span className="font-bold text-lg text-green-600">
                        {exp.amount}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => confirmDelete(exp._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full max-h-[80vh] rounded-t-3xl p-6 animate-[slideUp_0.3s_ease-out]">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
            <h2 className="text-xl font-bold mb-6 text-center">
              {editingId ? "Update Expense" : "Add New Expense"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2" />
                  Date
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaFileAlt className="inline mr-2" />
                  Title *
                </label>
                <input
                  type="text"
                  placeholder="Enter expense title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Enter description (optional)"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaRupeeSign className="inline mr-2" />
                  Amount *
                </label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                  {editingId ? "Update" : "Add"} Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-center mb-4">
              Delete Expense?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              This action cannot be undone. Are you sure you want to delete this
              expense?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteId(null);
                }}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default ExpenseTracker;
