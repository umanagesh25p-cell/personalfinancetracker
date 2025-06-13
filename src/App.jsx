import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import SignupLogin from "./components/SignupLogin";
import Dashboard from "./components/Dashboard/Dashboard";
import TransactionsPage from "./components/Transactions/TransactionsPage";
import BudgetPage from "./components/Budget/BudgetPage";
import ReportsPage from "./components/Reports/ReportsPage";
import GoalsPage from "./components/Goals/GoalsPage";

function RequireAuth({ user, children }) {
  return user ? children : <Navigate to="/auth" />;
}

function Welcome() {
  return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Login and use the tracker</h2>;
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedUser) setUser(loggedUser);
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("loggedInUser");
  };

  return (
    <Router>
      <div>
        <header>
          <h1
            style={{
              textAlign: "right",
              color: "#007bff",
              fontWeight: 800,
              letterSpacing: "2px",
              margin: "24px 24px 8px 0",
              fontFamily: "'Montserrat', Arial, sans-serif",
              fontSize: "2.2rem"
            }}
          >
            Money<span style={{ color: "#0056b3" }}>Mate</span>
          </h1>
        </header>
        <div
          style={{
            maxWidth: 900,
            width: "100%",
            margin: "0 auto",
            padding: "24px 0",
            minHeight: "100vh",
            background: "#f8f9fa"
          }}
        >
          <Routes>
            {/* If not logged in, show only Signup/Login */}
            {!user ? (
              <Route path="/*" element={<SignupLogin setUser={setUser} />} />
            ) : (
              // If logged in, show the app with Layout (navbar)
              <Route path="/" element={<Layout user={user} onLogout={handleLogout} />}>
                <Route index element={<Dashboard />} />
                <Route path="transactions" element={<TransactionsPage />} />
                <Route path="budget" element={<BudgetPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="goals" element={<GoalsPage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Route>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
