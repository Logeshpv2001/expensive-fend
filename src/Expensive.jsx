import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaFilter,
  FaCalendarAlt,
  FaRupeeSign,
  FaSignOutAlt,
  FaChartLine,
} from "react-icons/fa";
import { message, Modal } from "antd";
import AxiosInstance from "./utilities/AxiosInstance";
import { useNavigate } from "react-router-dom";

function Expensive() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchCurrentMonthExpenses();
      fetchTotal();
    }
  }, []);

  const [editingId, setEditingId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    amount: "",
    date: "",
  });

  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // fetch current month on load
  useEffect(() => {
    fetchCurrentMonthExpenses();
    fetchTotal(); // default current month total
  }, []);

  // fetch only current month expenses
  const fetchCurrentMonthExpenses = async () => {
    try {
      const res = await AxiosInstance.get("/expenses/current-month");
      setExpenses(res.data);
    } catch {
      message.error("Failed to fetch current month expenses.");
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await AxiosInstance.get("/expenses");
      setExpenses(res.data);
    } catch {
      message.error("Failed to fetch expenses.");
    }
  };

  // fetch total (works for both current month and filters)
  const fetchTotal = async (from, to) => {
    try {
      let url = "/expenses/total"; // base endpoint
      if (from && to) {
        url += `?from=${from}&to=${to}`;
      }
      const res = await AxiosInstance.get(url);
      setTotal(res.data.total);
    } catch {
      message.error("Failed to fetch total spent.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount) return;

    try {
      await AxiosInstance.post("/expenses", {
        title: form.title,
        description: form.description,
        amount: parseFloat(form.amount),
        date: form.date,
      });

      message.success("Expense added successfully!");
      setForm({ title: "", description: "", amount: "", date: "" });
      setIsFormOpen(false);
      fetchCurrentMonthExpenses();
      fetchTotal();
    } catch (err) {
      message.error("Failed to add expense.");
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "Do you really want to delete this expense?",
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await AxiosInstance.delete(`/expenses/${id}`);
          message.success("Expense deleted successfully!");
          fetchCurrentMonthExpenses();
          fetchTotal(); // refresh total after update
        } catch (error) {
          message.error("Failed to delete expense.");
        }
      },
    });
  };

  // filter
  const handleFilter = async () => {
    if (!fromDate || !toDate) {
      message.warning("Please select both dates.");
      return;
    }
    try {
      const res = await AxiosInstance.get(
        `/expenses/filter?from=${fromDate}&to=${toDate}`
      );
      setExpenses(res.data);
      fetchTotal(fromDate, toDate);
    } catch {
      message.error("Failed to filter expenses.");
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
    setIsFormOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount) return;

    try {
      await AxiosInstance.patch(`/expenses/${editingId}`, {
        title: form.title,
        description: form.description,
        amount: parseFloat(form.amount),
        date: form.date,
      });

      message.success("Expense updated successfully!");
      setForm({ title: "", description: "", amount: "", date: "" });
      setEditingId(null);
      setIsFormOpen(false);
      fetchCurrentMonthExpenses();
      fetchTotal(); // refresh total after update
    } catch (err) {
      message.error("Failed to update expense.");
    }
  };

  const resetFilters = () => {
    setFromDate("");
    setToDate("");
    fetchCurrentMonthExpenses();
    fetchTotal();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-xl">
                <FaChartLine className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Lv's ExpenseFlow
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Professional Expense Management
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <FaSignOutAlt className="text-sm" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl text-white p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">
                Total Expenses
              </p>
              <p className="text-3xl sm:text-4xl font-bold flex items-center">
                <FaRupeeSign className="text-2xl sm:text-3xl mr-1" />
                {total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </p>
              <p className="text-indigo-200 text-xs mt-1">
                {expenses.length} transactions
              </p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-2xl">
              <FaChartLine className="text-3xl" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <FaPlus />
            <span>Add New Expense</span>
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <FaFilter />
            <span>Filter Expenses</span>
          </button>
        </div>

        {/* Filter Section */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <FaCalendarAlt className="text-indigo-600" />
              <span>Filter by Date Range</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleFilter}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition-colors font-medium"
              >
                Apply Filter
              </button>
              <button
                onClick={resetFilters}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl transition-colors font-medium"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Add/Edit Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800">
                  {editingId ? "Update Expense" : "Add New Expense"}
                </h3>
              </div>

              <form
                onSubmit={editingId ? handleUpdate : handleSubmit}
                className="p-6 space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">
                    Date
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">
                    Expense Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Lunch at restaurant"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">
                    Description
                  </label>
                  <textarea
                    placeholder="Additional details (optional)"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    rows="3"
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) =>
                      setForm({ ...form, amount: e.target.value })
                    }
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-all duration-200"
                  >
                    {editingId ? "Update Expense" : "Add Expense"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      setEditingId(null);
                      setForm({
                        title: "",
                        description: "",
                        amount: "",
                        date: "",
                      });
                    }}
                    className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Expenses List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">
              Recent Expenses
            </h3>
          </div>

          {expenses.length === 0 ? (
            <div className="p-12 text-center">
              <div className="bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <FaChartLine className="text-gray-400 text-2xl" />
              </div>
              <p className="text-gray-500 text-lg font-medium">
                No expenses found
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Add your first expense to get started
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {expenses.map((exp, index) => (
                      <tr
                        key={exp._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {(() => {
                              const d = new Date(exp.date);
                              const day = String(d.getDate()).padStart(2, "0");
                              const month = String(d.getMonth() + 1).padStart(
                                2,
                                "0"
                              );
                              const year = d.getFullYear();
                              return `${day}/${month}/${year}`;
                            })()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {exp.title}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-xs truncate">
                            {exp.description || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm font-bold text-gray-900 flex items-center justify-end">
                            <FaRupeeSign className="text-xs mr-1" />
                            {exp.amount.toLocaleString("en-IN", {
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center space-x-3">
                            <button
                              onClick={() => handleEdit(exp)}
                              className="text-indigo-600 hover:text-indigo-800 p-2 hover:bg-indigo-50 rounded-lg transition-all"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(exp._id)}
                              className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y divide-gray-200">
                {expenses.map((exp) => (
                  <div
                    key={exp._id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {exp.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {(() => {
                            const d = new Date(exp.date);
                            const day = String(d.getDate()).padStart(2, "0");
                            const month = String(d.getMonth() + 1).padStart(
                              2,
                              "0"
                            );
                            const year = d.getFullYear();
                            return `${day}/${month}/${year}`;
                          })()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 flex items-center">
                          <FaRupeeSign className="text-xs mr-1" />
                          {exp.amount.toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>

                    {exp.description && (
                      <p className="text-sm text-gray-600 mb-3">
                        {exp.description}
                      </p>
                    )}

                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => handleEdit(exp)}
                        className="text-indigo-600 hover:text-indigo-800 p-2 hover:bg-indigo-50 rounded-lg transition-all"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(exp._id)}
                        className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Expensive;
