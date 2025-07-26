import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [expenses, setExpenses] = useState([]);
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
    const res = await axios.get("https://expensive-bend.onrender.com/api/expenses");
    setExpenses(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount) return;
    await axios.post("https://expensive-bend.onrender.com/api/expenses", {
      title: form.title,
      description: form.description,
      amount: parseFloat(form.amount),
      date: form.date, // include date here
    });

    setForm({ title: "", description: "", amount: "", date: "" });

    fetchExpenses();
  };

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-blue-100 to-blue-300 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-blue-700">
          Monthly Expense Tracker
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="border p-2 rounded-md text-sm sm:text-base"
          />

          <input
            type="text"
            placeholder="Expense Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border p-2 rounded-md text-sm sm:text-base"
          />
          <textarea
            placeholder="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border p-2 rounded-md text-sm sm:text-base"
          ></textarea>
          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="border p-2 rounded-md text-sm sm:text-base"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 text-sm sm:text-base"
          >
            Add Expense
          </button>
        </form>

        <h3 className="text-lg sm:text-xl font-semibold mb-3">All Expenses</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm sm:text-base text-left border">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp._id} className="border-b hover:bg-gray-50">
                  <td className="p-2 border">
                    {(() => {
                      const d = new Date(exp.date);
                      const day = String(d.getDate()).padStart(2, "0");
                      const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
                      const year = d.getFullYear();
                      return `${day}/${month}/${year}`;
                    })()}
                  </td>

                  <td className="p-2 border">{exp.title}</td>
                  <td className="p-2 border">{exp.description}</td>
                  <td className="p-2 border font-semibold">₹{exp.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-right text-lg sm:text-xl font-bold text-blue-800">
          Total Spent: ₹{total.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

export default App;
