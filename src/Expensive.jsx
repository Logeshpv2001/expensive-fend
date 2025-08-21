import React, { useEffect, useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaFilter,
  FaCalendarAlt,
  FaRupeeSign,
  FaFileInvoiceDollar,
  FaTimes,
} from "react-icons/fa";
import AxiosInstance from "./utilities/AxiosInstance";

// Mock AxiosInstance and message for demo

const message = {
  success: (msg) => console.log("Success:", msg),
  error: (msg) => console.log("Error:", msg),
  warning: (msg) => console.log("Warning:", msg),
};

const Modal = {
  confirm: ({ onOk }) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      onOk();
    }
  },
};

function Expensive() {
  const [editingId, setEditingId] = useState(null);
  const [showMobileForm, setShowMobileForm] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

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

  useEffect(() => {
    fetchCurrentMonthExpenses();
    fetchTotal();
  }, []);

  const fetchCurrentMonthExpenses = async () => {
    try {
      const res = await AxiosInstance.get("/expenses/current-month");
      console.log(res);
      setExpenses(res.data);
    } catch {
      message.error("Failed to fetch current month expenses.");
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await AxiosInstance.get("/api/expenses");
      setExpenses(res.data);
    } catch {
      message.error("Failed to fetch expenses.");
    }
  };

  const fetchTotal = async (from, to) => {
    try {
      let url = "/expenses/total";
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
      await AxiosInstance.post("/api/expenses", {
        title: form.title,
        description: form.description,
        amount: parseFloat(form.amount),
        date: form.date,
      });

      message.success("Expense added successfully!");
      setForm({ title: "", description: "", amount: "", date: "" });
      setShowMobileForm(false);
      fetchExpenses();
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
          await AxiosInstance.delete(`/api/expenses/${id}`);
          message.success("Expense deleted successfully!");
          fetchCurrentMonthExpenses();
          fetchTotal();
        } catch (error) {
          message.error("Failed to delete expense.");
        }
      },
    });
  };

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
      setShowMobileFilter(false);
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
    setShowMobileForm(true);
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
      setShowMobileForm(false);
      fetchCurrentMonthExpenses();
      fetchTotal();
    } catch (err) {
      message.error("Failed to update expense.");
    }
  };

  const resetForm = () => {
    setForm({ title: "", description: "", amount: "", date: "" });
    setEditingId(null);
    setShowMobileForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <FaFileInvoiceDollar className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Lv's ExpenseTracker Pro
                </h1>
                <p className="text-sm text-gray-500">
                  Manage your expenses smartly
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold text-red-600">
                  ₹{total.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Total Card */}
      <div className="sm:hidden bg-gradient-to-r from-red-500 to-pink-600 mx-4 mt-4 rounded-2xl p-4 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-100 text-sm">Total Spent This Period</p>
            <p className="text-2xl font-bold">
              ₹{total.toLocaleString("en-IN")}
            </p>
          </div>
          <FaRupeeSign className="text-3xl text-red-200" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Desktop Filter Section */}
        <div className="hidden sm:block bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex items-center space-x-4">
            <FaFilter className="text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-800">
              Filter Expenses
            </h3>
          </div>
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="pt-6">
              <button
                onClick={handleFilter}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Desktop Form */}
          <div className="hidden sm:block lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-6">
              <div className="flex items-center space-x-3 mb-6">
                <FaPlus className="text-green-500" />
                <h3 className="text-lg font-semibold text-gray-800">
                  {editingId ? "Update Expense" : "Add New Expense"}
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) =>
                        setForm({ ...form, date: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter expense title"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (₹)
                  </label>
                  <div className="relative">
                    <FaRupeeSign className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="number"
                      placeholder="0.00"
                      value={form.amount}
                      onChange={(e) =>
                        setForm({ ...form, amount: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={editingId ? handleUpdate : handleSubmit}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  {editingId ? "Update Expense" : "Add Expense"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full bg-gray-500 text-white py-3 rounded-xl hover:bg-gray-600 transition-all duration-200 font-medium"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Expenses List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800">
                  Recent Expenses
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Track and manage your spending
                </p>
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {expenses.map((exp) => (
                      <tr
                        key={exp._id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {exp.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {exp.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                          ₹{exp.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center space-x-3">
                          <button
                            onClick={() => handleEdit(exp)}
                            className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-all duration-150"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(exp._id)}
                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-all duration-150"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="sm:hidden divide-y divide-gray-200">
                {expenses.map((exp) => (
                  <div key={exp._id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {exp.title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
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
                        <p className="font-bold text-lg text-red-600">
                          ₹{exp.amount}
                        </p>
                        <div className="flex space-x-2 mt-1">
                          <button
                            onClick={() => handleEdit(exp)}
                            className="text-blue-600 p-2 hover:bg-blue-50 rounded-lg"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(exp._id)}
                            className="text-red-600 p-2 hover:bg-red-50 rounded-lg"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                    {exp.description && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile FABs */}
      <div className="sm:hidden fixed bottom-6 right-4 flex flex-col space-y-3">
        <button
          onClick={() => setShowMobileFilter(true)}
          className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-200"
        >
          <FaFilter className="text-xl" />
        </button>
        <button
          onClick={() => setShowMobileForm(true)}
          className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-200"
        >
          <FaPlus className="text-xl" />
        </button>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilter && (
        <div className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Filter Expenses</h3>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="text-gray-500 p-2"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleFilter}
                className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Form Modal */}
      {showMobileForm && (
        <div className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                {editingId ? "Update Expense" : "Add New Expense"}
              </h3>
              <button onClick={resetForm} className="text-gray-500 p-2">
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter expense title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={editingId ? handleUpdate : handleSubmit}
                className="w-full bg-green-500 text-white py-3 rounded-xl font-medium"
              >
                {editingId ? "Update Expense" : "Add Expense"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Expensive;
