// src/services/expenseService.js
import AxiosInstance from "../utilities/AxiosInstance";

// Fetch all expenses
export const getExpenses = async () => {
  const res = await AxiosInstance.get("/expenses");
  return res.data;
};

// Add new expense
export const addExpense = async (expense) => {
  const res = await AxiosInstance.post("/expenses", expense);
  return res.data;
};

// Update expense
export const updateExpense = async (id, expense) => {
  const res = await AxiosInstance.patch(`/expenses/${id}`, expense);
  return res.data;
};

// Delete expense
export const deleteExpense = async (id) => {
  const res = await AxiosInstance.delete(`/expenses/${id}`);
  return res.data;
};
