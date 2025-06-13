import React, { useEffect, useState } from "react";

const categories = ["Savings", "Education", "Travel", "Health", "Other"];

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [goalName, setGoalName] = useState("");
  const [amount, setAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [notes, setNotes] = useState("");
  const [editIdx, setEditIdx] = useState(null);
  const [editData, setEditData] = useState({
    goalName: "",
    amount: "",
    targetDate: "",
    category: categories[0],
    notes: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) {
      const stored = JSON.parse(localStorage.getItem(`goals_${user.email}`)) || [];
      setGoals(stored);
    }
  }, []);

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!goalName || !amount || !targetDate || !category) return;
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const newGoal = {
      goalName,
      amount: parseFloat(amount),
      targetDate,
      category,
      notes,
      createdAt: new Date().toLocaleDateString(),
      achieved: false,
    };
    const updated = [newGoal, ...goals];
    setGoals(updated);
    localStorage.setItem(`goals_${user.email}`, JSON.stringify(updated));
    setGoalName("");
    setAmount("");
    setTargetDate("");
    setCategory(categories[0]);
    setNotes("");
  };

  const handleDelete = (idx) => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const updated = goals.filter((_, i) => i !== idx);
    setGoals(updated);
    localStorage.setItem(`goals_${user.email}`, JSON.stringify(updated));
  };

  const handleEdit = (idx) => {
    setEditIdx(idx);
    const g = goals[idx];
    setEditData({
      goalName: g.goalName,
      amount: g.amount,
      targetDate: g.targetDate,
      category: g.category,
      notes: g.notes || "",
    });
  };

  const handleSaveEdit = (idx) => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const updated = [...goals];
    updated[idx] = {
      ...updated[idx],
      ...editData,
      amount: parseFloat(editData.amount),
    };
    setGoals(updated);
    localStorage.setItem(`goals_${user.email}`, JSON.stringify(updated));
    setEditIdx(null);
  };

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
      <div className="min-card">
        <h2 className="section-title">Set a New Goal</h2>
        <form
          onSubmit={handleAddGoal}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "flex-end",
            marginBottom: 0,
            width: "100%",
          }}
        >
          <input
            className="min-input"
            style={{ flex: "1 1 160px" }}
            value={goalName}
            onChange={e => setGoalName(e.target.value)}
            placeholder="Goal Name"
            required
          />
          <input
            className="min-input"
            style={{ flex: "1 1 120px" }}
            value={amount}
            onChange={e => setAmount(e.target.value)}
            type="number"
            placeholder="Target Amount (₹)"
            required
          />
          <input
            className="min-input"
            style={{ flex: "1 1 140px" }}
            value={targetDate}
            onChange={e => setTargetDate(e.target.value)}
            type="date"
            required
          />
          <select
            className="min-select"
            style={{ flex: "1 1 120px" }}
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            className="min-input"
            style={{ flex: "2 1 180px" }}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Notes (optional)"
          />
          <button
            className="min-btn"
            type="submit"
            style={{
              flex: "1 1 120px",
              minWidth: 120,
              background: "linear-gradient(90deg, #007bff 60%, #0056b3 100%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.08rem",
              borderRadius: 8,
              border: "none",
              padding: "12px 0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              letterSpacing: "1px",
              transition: "background 0.2s, transform 0.1s",
              cursor: "pointer"
            }}
            onMouseOver={e => e.currentTarget.style.background = "#0056b3"}
            onMouseOut={e => e.currentTarget.style.background = "linear-gradient(90deg, #007bff 60%, #0056b3 100%)"}
          >
            Add Goal
          </button>
        </form>
      </div>

      <div className="min-card">
        <h4 className="section-title" style={{ fontSize: "1.1rem" }}>Your Goals</h4>
        {goals.length === 0 ? (
          <p style={{ color: "#888", margin: "18px 0" }}>No goals set yet.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              className="min-table"
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                borderRadius: 12,
                overflow: "hidden",
                background: "#fff",
                minWidth: 500 // Ensures table scrolls on mobile
              }}
            >
              <thead>
                <tr style={{ background: "#f3f6fa" }}>
                  <th style={{ padding: "14px 18px", fontWeight: 700, fontSize: "1.05em" }}>Goal</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, fontSize: "1.05em" }}>Amount (₹)</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, fontSize: "1.05em" }}>Target Date</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, fontSize: "1.05em" }}>Category</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, fontSize: "1.05em" }}>Notes</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, fontSize: "1.05em" }}>Created</th>
                  <th style={{ padding: "14px 18px", fontWeight: 700, fontSize: "1.05em" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {goals.map((g, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #e9ecef" }}>
                    {editIdx === idx ? (
                      <>
                        <td style={{ padding: "12px 18px" }}>
                          <input
                            className="min-input"
                            style={{ width: 120 }}
                            value={editData.goalName}
                            onChange={e => setEditData({ ...editData, goalName: e.target.value })}
                          />
                        </td>
                        <td style={{ padding: "12px 18px" }}>
                          <input
                            className="min-input"
                            style={{ width: 90 }}
                            value={editData.amount}
                            onChange={e => setEditData({ ...editData, amount: e.target.value })}
                            type="number"
                          />
                        </td>
                        <td style={{ padding: "12px 18px" }}>
                          <input
                            className="min-input"
                            style={{ width: 120 }}
                            value={editData.targetDate}
                            onChange={e => setEditData({ ...editData, targetDate: e.target.value })}
                            type="date"
                          />
                        </td>
                        <td style={{ padding: "12px 18px" }}>
                          <select
                            className="min-select"
                            style={{ width: 100 }}
                            value={editData.category}
                            onChange={e => setEditData({ ...editData, category: e.target.value })}
                          >
                            {categories.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: "12px 18px" }}>
                          <input
                            className="min-input"
                            style={{ width: 120 }}
                            value={editData.notes}
                            onChange={e => setEditData({ ...editData, notes: e.target.value })}
                          />
                        </td>
                        <td style={{ padding: "12px 18px" }}>{g.createdAt}</td>
                        <td style={{ padding: "12px 18px", whiteSpace: "nowrap" }}>
                          <button
                            style={{
                              minWidth: 60,
                              background: "#007bff",
                              color: "#fff",
                              border: "none",
                              borderRadius: 4,
                              fontWeight: 600,
                              marginRight: 8,
                              transition: "background 0.2s",
                              padding: "6px 14px"
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
                              minWidth: 60,
                              background: "#f8f9fa",
                              color: "#007bff",
                              border: "1px solid #007bff",
                              borderRadius: 4,
                              fontWeight: 600,
                              transition: "background 0.2s, color 0.2s",
                              padding: "6px 14px"
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
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: "12px 18px" }}>{g.goalName}</td>
                        <td style={{ padding: "12px 18px" }}>{g.amount}</td>
                        <td style={{ padding: "12px 18px" }}>{g.targetDate}</td>
                        <td style={{ padding: "12px 18px" }}>{g.category}</td>
                        <td style={{ padding: "12px 18px" }}>{g.notes || "-"}</td>
                        <td style={{ padding: "12px 18px" }}>{g.createdAt}</td>
                        <td style={{ padding: "12px 18px", whiteSpace: "nowrap" }}>
                          <button
                            style={{
                              minWidth: 60,
                              border: "1.5px solid #007bff",
                              color: "#007bff",
                              background: "white",
                              borderRadius: 4,
                              fontWeight: 600,
                              marginRight: 8,
                              transition: "background 0.2s, color 0.2s",
                              padding: "6px 14px"
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
                              padding: "6px 14px"
                            }}
                            onMouseOver={e => (e.currentTarget.style.background = "#0056b3")}
                            onMouseOut={e => (e.currentTarget.style.background = "#007bff")}
                            onClick={() => handleDelete(idx)}
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
