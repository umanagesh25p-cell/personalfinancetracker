import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

function ReportsPage() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) {
      const stored = JSON.parse(localStorage.getItem(`transactions_${user.email}`)) || [];
      setTransactions(stored);
    }
  }, []);

  // Group transactions by month and category
  const reportData = {};
  transactions.forEach(tx => {
    // Format: MM/YYYY
    const [month, day, year] = tx.date.split("/");
    const key = `${month.padStart(2, "0")}/${year}`;
    if (!reportData[key]) reportData[key] = { income: 0, expense: 0 };
    if (tx.type === "income") reportData[key].income += tx.amount;
    if (tx.type === "expense") reportData[key].expense += tx.amount;
  });

  // Sorted months
  const months = Object.keys(reportData).sort((a, b) => {
    const [ma, ya] = a.split("/");
    const [mb, yb] = b.split("/");
    return ya !== yb ? ya - yb : ma - mb;
  });

  // Bar chart data
  const barChartData = {
    labels: months,
    datasets: [
      {
        label: "Income",
        backgroundColor: "#28a745",
        data: months.map(m => reportData[m]?.income || 0),
      },
      {
        label: "Expense",
        backgroundColor: "#dc3545",
        data: months.map(m => Math.abs(reportData[m]?.expense || 0)),
      },
    ],
  };

  // Calculate your totals here
  const totalIncome = transactions
    .filter(tx => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpense = transactions
    .filter(tx => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const netSavings = totalIncome - totalExpense;

  // CSV Download Handler
  const handleDownloadCSV = () => {
    if (!transactions.length) return;
    const header = "Date,Type,Category,Description,Amount\n";
    const rows = transactions.map(tx =>
      [
        tx.date,
        tx.type,
        tx.category,
        tx.desc ? `"${tx.desc.replace(/"/g, '""')}"` : "",
        tx.amount
      ].join(",")
    );
    const csvContent = header + rows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions_report.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      <div>
        <h2 className="section-title" style={{ textAlign: "center" }}>Reports</h2>
        <p style={{ textAlign: "center", color: "#666", marginBottom: 24 }}>
          Here’s a summary of your spending, income, and trends. Use the filters and charts below to analyze your finances.
        </p>
        <div className="report-filters" style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 24 }}>
          <select className="blue-select">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
            <option>Custom Range</option>
          </select>
        </div>
        <div className="report-summary" style={{ display: "flex", gap: 24, justifyContent: "center", marginBottom: 24 }}>
          <div className="summary-card">Total Income: ₹{totalIncome.toFixed(2)}</div>
          <div className="summary-card">Total Expense: ₹{totalExpense.toFixed(2)}</div>
          <div className="summary-card">Net Savings: ₹{netSavings.toFixed(2)}</div>
        </div>
        {/* Bar Chart */}
        <div style={{ maxWidth: 700, margin: "0 auto 32px auto", background: "#fff", borderRadius: 12, padding: 16 }}>
          <Bar data={barChartData} />
        </div>
        <button className="min-btn" style={{ marginBottom: 16 }} onClick={handleDownloadCSV}>Download CSV</button>
        {/* Place your table here */}
        {/* <table className="report-table">...</table> */}
        {/* <div className="report-insight">Your highest expense was on Food this month.</div> */}
      </div>
    </div>
  );
}

export default ReportsPage;
