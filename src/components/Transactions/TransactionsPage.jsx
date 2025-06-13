import React, { useState, useEffect } from "react";

const categories = {
  income: ["Salary", "Business", "Investment", "Other"],
  expense: [
    "Food",
    "Shopping",
    "Bills",
    "Travel",
    "Groceries",      // Added
    "Health",         // Added
    "Education",      // Added
    "Entertainment",  // Added
    "Utilities",      // Added
    "Other"
  ],
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState(categories.income[0]);

  // Load transactions from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) {
      const stored = JSON.parse(localStorage.getItem(`transactions_${user.email}`)) || [];
      setTransactions(stored);
    }
  }, []);

  // Add transaction
  const handleAdd = (e) => {
    e.preventDefault();
    if (!desc || !amount || !category) return;
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const amt = parseFloat(amount);
    const tx = {
      desc,
      amount: type === "income" ? Math.abs(amt) : -Math.abs(amt),
      type,
      category,
      date: new Date().toLocaleDateString(),
    };
    const updated = [tx, ...transactions];
    setTransactions(updated);
    localStorage.setItem(`transactions_${user.email}`, JSON.stringify(updated));
    setDesc("");
    setAmount("");
    setType("income");
    setCategory(categories.income[0]);
  };

  // Update category options when type changes
  useEffect(() => {
    setCategory(categories[type][0]);
  }, [type]);

  // Delete transaction by index
  const handleDelete = (idx) => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const updated = transactions.filter((_, i) => i !== idx);
    setTransactions(updated);
    localStorage.setItem(`transactions_${user.email}`, JSON.stringify(updated));
  };

  // Edit state
  const [editIdx, setEditIdx] = useState(null);
  const [editData, setEditData] = useState({ desc: "", amount: "", type: "", category: "" });

  // Start editing
  const handleEdit = (idx) => {
    setEditIdx(idx);
    const tx = transactions[idx];
    setEditData({
      desc: tx.desc,
      amount: Math.abs(tx.amount),
      type: tx.type,
      category: tx.category,
    });
  };

  // Save edited transaction
  const handleSaveEdit = (idx) => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const updated = [...transactions];
    updated[idx] = {
      ...updated[idx],
      desc: editData.desc,
      amount: editData.type === "income" ? Math.abs(Number(editData.amount)) : -Math.abs(Number(editData.amount)),
      type: editData.type,
      category: editData.category,
    };
    setTransactions(updated);
    localStorage.setItem(`transactions_${user.email}`, JSON.stringify(updated));
    setEditIdx(null);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditIdx(null);
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
      <style>
        {`
        @media (max-width: 600px) {
          .transactions-form {
            flex-direction: column !important;
            gap: 4px !important;
            padding: 8px !important;
          }
          .transactions-form input,
          .transactions-form select {
            font-size: 0.97em !important;
            padding: 7px 8px !important;
            min-width: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin-bottom: 4px !important;
          }
          .transactions-form .form-check-inline {
            display: flex !important;
            align-items: center !important;
            margin-bottom: 4px !important;
            margin-right: 12px !important;
          }
          .transactions-form .form-check-input {
            width: 16px !important;
            height: 16px !important;
            margin-right: 4px !important;
          }
          .transactions-form .btn,
          .transactions-form button {
            font-size: 1em !important;
            padding: 8px 0 !important;
            min-width: 100% !important;
            margin-top: 4px !important;
            border-radius: 6px !important;
          }
          .transactions-list .list-group-item {
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 12px 8px !important;
            font-size: 1em !important;
            gap: 6px !important;
          }
          .transactions-list input,
          .transactions-list select {
            font-size: 0.97em !important;
            padding: 7px 8px !important;
            min-width: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin-bottom: 4px !important;
          }
          .transactions-list button {
            font-size: 0.97em !important;
            padding: 7px 0 !important;
            min-width: 80px !important;
            margin-right: 6px !important;
            margin-bottom: 4px !important;
            border-radius: 6px !important;
          }
          .transactions-list .edit-actions {
            width: 100% !important;
            display: flex !important;
            gap: 6px !important;
            margin-top: 4px !important;
          }
          .transactions-list .tx-row {
            width: 100% !important;
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 6px !important;
            align-items: center !important;
          }
          /* Nav bar buttons */
          .navbar .btn,
          .navbar button,
          .navbar a {
            font-size: 0.97em !important;
            padding: 7px 8px !important;
            min-width: 44px !important;
            margin: 0 1px !important;
            border-radius: 5px !important;
          }
          .navbar {
            flex-wrap: wrap !important;
            gap: 2px !important;
          }
        }
        `}
      </style>
      <h2 style={{ textAlign: "center", color: "#007bff" }}>Transactions</h2>
      <form
        className="transactions-form"
        onSubmit={handleAdd}
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 16,
          background: "#fff",
          padding: 12,
          borderRadius: 8,
          boxShadow: "0 1px 6px rgba(0,0,0,0.04)"
        }}
      >
        <input
          className="form-control"
          style={{ maxWidth: 180, flex: "1 1 120px" }}
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Description"
        />
        <input
          className="form-control"
          style={{ maxWidth: 120, flex: "1 1 80px" }}
          value={amount}
          onChange={e => setAmount(e.target.value)}
          type="number"
          placeholder="Amount"
        />
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="type"
            id="income"
            value="income"
            checked={type === "income"}
            onChange={() => setType("income")}
          />
          <label className="form-check-label" htmlFor="income">Income</label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="type"
            id="expense"
            value="expense"
            checked={type === "expense"}
            onChange={() => setType("expense")}
          />
          <label className="form-check-label" htmlFor="expense">Expense</label>
        </div>
        <select
          className="form-select"
          style={{ maxWidth: 140, flex: "1 1 90px" }}
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          {categories[type].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button className="btn btn-primary" type="submit" style={{ minWidth: 80 }}>Add</button>
      </form>
      <ul className="list-group transactions-list" style={{ padding: 0 }}>
        {transactions.map((tx, idx) => (
          <li
            className="list-group-item d-flex align-items-center"
            key={idx}
            style={{
              borderLeft: `6px solid ${tx.type === "income" ? "#28a745" : "#dc3545"}`,
              background: tx.type === "income" ? "#eafaf1" : "#fff0f0",
              marginBottom: 10,
              padding: "18px 18px",
              borderRadius: 8,
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              overflowX: "auto"
            }}
          >
            {editIdx === idx ? (
              <div className="tx-row">
                <div style={{ display: "flex", alignItems: "center", width: "100%", gap: 12, flexWrap: "wrap" }}>
                  <input
                    className="form-control"
                    style={{ maxWidth: 140, flex: "1 1 100px" }}
                    value={editData.desc}
                    onChange={e => setEditData({ ...editData, desc: e.target.value })}
                    placeholder="Description"
                  />
                  <select
                    className="form-select"
                    style={{ maxWidth: 120, flex: "1 1 80px" }}
                    value={editData.category}
                    onChange={e => setEditData({ ...editData, category: e.target.value })}
                  >
                    {categories[editData.type].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <input
                    className="form-control"
                    style={{ maxWidth: 90, flex: "1 1 60px" }}
                    value={editData.amount}
                    onChange={e => setEditData({ ...editData, amount: e.target.value })}
                    type="number"
                    placeholder="Amount"
                  />
                  <select
                    className="form-select"
                    style={{ maxWidth: 110, flex: "1 1 70px" }}
                    value={editData.type}
                    onChange={e => {
                      setEditData(ed => ({
                        ...ed,
                        type: e.target.value,
                        category: categories[e.target.value][0],
                      }));
                    }}
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                  <span style={{ minWidth: 90, color: "#888", fontSize: "0.98em" }}>{tx.date}</span>
                </div>
                <div className="edit-actions" style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button
                    style={{
                      minWidth: 70,
                      background: "#007bff",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      fontWeight: 600,
                      transition: "background 0.2s",
                    }}
                    onMouseOver={e => (e.currentTarget.style.background = "#0056b3")}
                    onMouseOut={e => (e.currentTarget.style.background = "#007bff")}
                    onClick={() => handleSaveEdit(idx)}
                    type="button"
                  >
                    Save
                  </button>
                  <button
                    style={{
                      minWidth: 70,
                      background: "#f8f9fa",
                      color: "#007bff",
                      border: "1px solid #007bff",
                      borderRadius: 4,
                      fontWeight: 600,
                      transition: "background 0.2s, color 0.2s",
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = "#e2e6ea";
                      e.currentTarget.style.color = "#0056b3";
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = "#f8f9fa";
                      e.currentTarget.style.color = "#007bff";
                    }}
                    onClick={handleCancelEdit}
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="tx-row">
                <div style={{ display: "flex", alignItems: "center", width: "100%", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ minWidth: 120, fontWeight: 600 }}>{tx.desc}</div>
                  <div style={{ minWidth: 90, color: "#555" }}>{tx.category}</div>
                  <div style={{ minWidth: 80, color: "#888", fontSize: "0.98em" }}>{tx.date}</div>
                  <div style={{ minWidth: 80, color: tx.type === "income" ? "#28a745" : "#dc3545", fontWeight: 600 }}>
                    {tx.type === "income" ? "+" : "-"}₹{Math.abs(tx.amount).toFixed(2)}
                  </div>
                </div>
                <div className="edit-actions" style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button
                    style={{
                      minWidth: 60,
                      border: "1.5px solid #007bff",
                      color: "#007bff",
                      background: "white",
                      borderRadius: 4,
                      fontWeight: 600,
                      transition: "background 0.2s, color 0.2s",
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = "#007bff";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = "white";
                      e.currentTarget.style.color = "#007bff";
                    }}
                    onClick={() => handleEdit(idx)}
                  >
                    Edit
                  </button>
                  <button
                    style={{
                      minWidth: 60,
                      background: "#007bff",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      fontWeight: 600,
                      transition: "background 0.2s",
                    }}
                    onMouseOver={e => (e.currentTarget.style.background = "#0056b3")}
                    onMouseOut={e => (e.currentTarget.style.background = "#007bff")}
                    onClick={() => handleDelete(idx)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
