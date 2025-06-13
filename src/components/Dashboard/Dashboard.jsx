import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) {
      const storedTx = JSON.parse(localStorage.getItem(`transactions_${user.email}`)) || [];
      setTransactions(storedTx);
      const storedGoals = JSON.parse(localStorage.getItem(`goals_${user.email}`)) || [];
      setGoals(storedGoals);
    }
  }, []);

  const income = transactions.filter(t => t.amount > 0).reduce((a, t) => a + t.amount, 0);
  const expense = transactions.filter(t => t.amount < 0).reduce((a, t) => a + t.amount, 0);
  const balance = income + expense;

  // Pie chart data for Income vs Expense
  const pieData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [income, Math.abs(expense)],
        backgroundColor: ["#28a745", "#dc3545"],
      },
    ],
  };

  // Pie chart data for Goals
  const goalData = {
    labels: goals.map(g => g.goalName),
    datasets: [
      {
        data: goals.map(g => g.amount),
        backgroundColor: [
          "#007bff", "#28a745", "#ffc107", "#dc3545", "#6f42c1", "#20c997", "#fd7e14"
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
      <h2 style={{ textAlign: "center", color: "#007bff", marginBottom: 28 }}>Dashboard</h2>
      <div className="dashboard-grid">
        <div className="dashboard-card balance">
          <span className="icon" role="img" aria-label="Balance">💰</span>
          <div>
            <div className="label">Balance</div>
            <div className="value">₹{balance.toFixed(2)}</div>
          </div>
        </div>
        <div className="dashboard-card income">
          <span className="icon" role="img" aria-label="Income">⬆️</span>
          <div>
            <div className="label">Total Income</div>
            <div className="value">+₹{income.toFixed(2)}</div>
          </div>
        </div>
        <div className="dashboard-card expense">
          <span className="icon" role="img" aria-label="Expense">⬇️</span>
          <div>
            <div className="label">Total Expense</div>
            <div className="value">-₹{expense.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mb-4 text-center">
        <strong>Transactions:</strong> {transactions.length}
      </div>
      <h5 className="mb-3 text-center">Recent Transactions</h5>
      <ul className="recent-tx-list">
        {transactions.length === 0
          ? [<li key="empty" style={{ color: "#888", textAlign: "center", width: "100%" }}>No transactions yet.</li>]
          : transactions.slice(0, 5).map((tx, idx) => (
              <li key={idx}>
                <span style={{ marginRight: 8 }}>
                  {tx.type === "income" ? "⬆️" : "⬇️"}
                </span>
                <span className="desc">{tx.desc}</span>
                <span className={`amount ${tx.type}`}>{tx.type === "income" ? "+" : "-"}₹{Math.abs(tx.amount).toFixed(2)}</span>
                <span className="date">{tx.date}</span>
              </li>
            ))
        }
      </ul>

      <h5 className="mb-3 text-center">Overview (Pie Charts)</h5>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 32,
          flexWrap: "wrap",
          marginBottom: 32,
        }}
      >
        <div style={{ maxWidth: 280, width: "100%" }}>
          <h6 className="text-center" style={{ marginBottom: 12 }}>Income vs Expense</h6>
          {(income > 0 || expense < 0) ? (
            <Pie data={pieData} />
          ) : (
            <p className="text-center" style={{ fontSize: "0.95em" }}>No data to display.</p>
          )}
        </div>
        <div style={{ maxWidth: 280, width: "100%" }}>
          <h6 className="text-center" style={{ marginBottom: 12 }}>Goals Distribution</h6>
          {goals.length === 0 ? (
            <p className="text-center" style={{ fontSize: "0.95em" }}>No goals to display.</p>
          ) : (
            <Pie data={goalData} />
          )}
        </div>
      </div>
      {/* Goals Section */}
      <hr style={{ margin: "40px 0 24px 0" }} />
      <h4 className="mb-3 text-center" style={{ color: "#007bff" }}>Goals Overview</h4>
      {goals.length === 0 ? (
        <p className="text-center" style={{ color: "#888" }}>No goals to display.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="table table-bordered" style={{ margin: "0 auto", minWidth: 320, width: "100%" }}>
            <thead style={{ background: "#f3f6fa" }}>
              <tr>
                <th>Goal</th>
                <th>Amount (₹)</th>
                <th>Target Date</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {goals.map((g, idx) => (
                <tr key={idx}>
                  <td>{g.goalName}</td>
                  <td>{g.amount}</td>
                  <td>{g.targetDate}</td>
                  <td>{g.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <style>
      {`
      .dashboard-grid {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
        margin-bottom: 32px;
        justify-content: center;
      }
      .dashboard-card {
        flex: 1 1 220px;
        min-width: 180px;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.06);
        padding: 24px 18px;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 8px;
        gap: 18px;
        transition: box-shadow 0.18s;
        max-width: 300px;
      }
      .dashboard-card:hover {
        box-shadow: 0 4px 18px rgba(0,123,255,0.10);
      }
      .dashboard-card .icon {
        font-size: 2.2em;
        margin-right: 14px;
        opacity: 0.88;
        filter: drop-shadow(0 1px 2px rgba(0,0,0,0.07));
      }
      .dashboard-card .label {
        font-size: 1.02em;
        color: #888;
        margin-bottom: 6px;
      }
      .dashboard-card .value {
        font-size: 1.5em;
        font-weight: 700;
        margin-bottom: 0;
      }
      .dashboard-card.balance .value { color: #007bff; }
      .dashboard-card.income .value { color: #28a745; }
      .dashboard-card.expense .value { color: #dc3545; }
      /* Remove the column stacking on small screens */
      @media (max-width: 700px) {
        .dashboard-grid {
          flex-wrap: wrap;
          gap: 10px;
        }
        .dashboard-card {
          min-width: 140px;
          padding: 14px 8px;
          font-size: 0.97em;
          max-width: 100vw;
        }
      }
      .recent-tx-list {
        margin: 0 auto 36px auto;
        max-width: 700px;
        width: 100%;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 1px 8px rgba(0,0,0,0.05);
        padding: 0;
        overflow-x: auto;
      }
      .recent-tx-list li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 18px;
        border-bottom: 1px solid #f0f0f0;
        font-size: 1.04em;
        transition: background 0.15s;
      }
      .recent-tx-list li:hover {
        background: #f6faff;
      }
      .recent-tx-list li:last-child {
        border-bottom: none;
      }
      .recent-tx-list .desc {
        font-weight: 600;
        min-width: 90px;
      }
      .recent-tx-list .amount {
        font-weight: 600;
        min-width: 70px;
      }
      .recent-tx-list .income { color: #28a745; }
      .recent-tx-list .expense { color: #dc3545; }
      .recent-tx-list .date {
        color: #888;
        font-size: 0.97em;
        min-width: 80px;
      }
      @media (max-width: 600px) {
        .recent-tx-list li {
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
          padding: 12px 10px;
          font-size: 0.99em;
        }
        .recent-tx-list .desc,
        .recent-tx-list .amount,
        .recent-tx-list .date {
          min-width: 0;
        }
      }
      `}
      </style>
    </div>
  );
}
