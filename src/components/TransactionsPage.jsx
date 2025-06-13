import React, { useState, useEffect } from "react";

const categories = {
  income: ["Salary", "Business", "Investment", "Other"],
  expense: ["Food", "Shopping", "Bills", "Travel", "Other"],
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState(categories.income[0]);
  const [editIdx, setEditIdx] = useState(null);
  const [editData, setEditData] = useState({ desc: "", amount: "", type: "", category: "" });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) {
      const stored = JSON.parse(localStorage.getItem(`transactions_${user.email}`)) || [];
      setTransactions(stored);
    }
  }, []);

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

  useEffect(() => {
    setCategory(categories[type][0]);
  }, [type]);

  const handleDelete = (idx) => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const updated = transactions.filter((_, i) => i !== idx);
    setTransactions(updated);
    localStorage.setItem(`transactions_${user.email}`, JSON.stringify(updated));
  };

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

  const handleCancelEdit = () => {
    setEditIdx(null);
  };

  return (
    <div>
      <h2>Transactions</h2>
      <form onSubmit={handleAdd} style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        <input
          className="form-control"
          style={{ maxWidth: 180 }}
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Description"
        />
        <input
          className="form-control"
          style={{ maxWidth: 120 }}
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
          style={{ maxWidth: 140 }}
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          {categories[type].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button className="btn btn-primary" type="submit">Add</button>
      </form>
      <ul className="list-group">
        {transactions.map((tx, idx) => (
          <li
            className="list-group-item d-flex align-items-center"
            key={idx}
            style={{
              borderLeft: `6px solid ${tx.type === "income" ? "#28a745" : "#dc3545"}`,
              background: tx.type === "income" ? "#eafaf1" : "#fff0f0",
              marginBottom: 8,
              justifyContent: "space-between",
            }}
          >
            {editIdx === idx ? (
              // Edit Mode
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  className="form-control"
                  style={{ maxWidth: 120 }}
                  value={editData.desc}
                  onChange={e => setEditData({ ...editData, desc: e.target.value })}
                  placeholder="Description"
                />
                <input
                  className="form-control"
                  style={{ maxWidth: 90 }}
                  value={editData.amount}
                  onChange={e => setEditData({ ...editData, amount: e.target.value })}
                  type="number"
                  placeholder="Amount"
                />
                <select
                  className="form-select"
                  style={{ maxWidth: 110 }}
                  value={editData.type}
                  onChange={e => {
                    // When changing type, reset category to first of new type
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
                <select
                  className="form-select"
                  style={{ maxWidth: 110 }}
                  value={editData.category}
                  onChange={e => setEditData({ ...editData, category: e.target.value })}
                >
                  {categories[editData.type].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button
                  className="btn btn-success btn-sm"
                  style={{ minWidth: 60 }}
                  onClick={() => handleSaveEdit(idx)}
                  type="button"
                >
                  Save
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ minWidth: 60 }}
                  onClick={handleCancelEdit}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div style={{ flex: 1 }}>
                  <strong>{tx.desc}</strong> ({tx.category})
                  <div style={{ fontSize: "0.9em", color: "#888" }}>{tx.date}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
                  <span style={{ color: tx.type === "income" ? "#28a745" : "#dc3545", fontWeight: 600 }}>
                    {tx.type === "income" ? "+" : "-"}₹{Math.abs(tx.amount).toFixed(2)}
                  </span>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    style={{ minWidth: 60 }}
                    onClick={() => handleEdit(idx)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ minWidth: 60 }}
                    onClick={() => handleDelete(idx)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}