import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

export default function BudgetPage() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) {
      const stored = JSON.parse(localStorage.getItem(`transactions_${user.email}`)) || [];
      setTransactions(stored);
    }
  }, []);

  // Calculate totals
  const income = transactions.filter(t => t.amount > 0).reduce((a, t) => a + t.amount, 0);
  const expense = transactions.filter(t => t.amount < 0).reduce((a, t) => a + t.amount, 0);
  const balance = income + expense;

  // Group by category
  const categoryTotals = {};
  transactions.forEach(tx => {
    if (!categoryTotals[tx.category]) {
      categoryTotals[tx.category] = 0;
    }
    categoryTotals[tx.category] += tx.amount;
  });

  // Prepare data for Pie chart (expenses only)
  const expenseCategories = Object.entries(categoryTotals).filter(([cat, amt]) => amt < 0);
  const pieData = {
    labels: expenseCategories.map(([cat]) => cat),
    datasets: [
      {
        data: expenseCategories.map(([_, amt]) => Math.abs(amt)),
        backgroundColor: [
          "#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff", "#f67019"
        ],
      },
    ],
  };

  return (
    <div
      style={{
        maxWidth: 900,
        width: "100%",
        margin: "0 auto",
        padding: "24px 0",
        minHeight: "calc(100vh - 70px)",
        boxSizing: "border-box",
        background: "#f8f9fa"
      }}
    >
      <h2>Budget Overview</h2>
      <div className="mb-3">
        <strong>Total Income:</strong> ₹{income.toFixed(2)}
      </div>
      <div className="mb-3">
        <strong>Total Expenses:</strong> ₹{Math.abs(expense).toFixed(2)}
      </div>
      <div className="mb-3">
        <strong>Balance:</strong> ₹{balance.toFixed(2)}
      </div>
      <h4 className="mt-4">Category-wise Summary</h4>
      <ul className="list-group mb-4">
        {Object.entries(categoryTotals).map(([cat, amt]) => (
          <li
            className="list-group-item d-flex justify-content-between"
            key={cat}
            style={{
              color: amt >= 0 ? "#28a745" : "#dc3545",
              fontWeight: 500,
            }}
          >
            <span>{cat}</span>
            <span>
              {amt >= 0 ? "+" : "-"}₹{Math.abs(amt).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
      <h5>Expenses by Category (Pie Chart)</h5>
      {expenseCategories.length > 0 ? (
        <div style={{ maxWidth: 400, margin: "0 auto" }}>
          <Pie data={pieData} />
        </div>
      ) : (
        <p>No expense data to display.</p>
      )}
    </div>
  );
}
