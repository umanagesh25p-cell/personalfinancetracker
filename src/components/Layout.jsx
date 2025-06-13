import { NavLink, Outlet } from "react-router-dom";
import { FaTachometerAlt, FaExchangeAlt, FaWallet, FaChartBar, FaBullseye, FaSignOutAlt, FaSignInAlt, FaMoon, FaSun } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Layout({ user, onLogout }) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "true");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  return (
    <div>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "24px 24px 8px 0",
          position: "relative"
        }}
      >
        <h1
          style={{
            textAlign: "right",
            color: "#007bff",
            fontWeight: 800,
            letterSpacing: "2px",
            fontFamily: "'Montserrat', Arial, sans-serif",
            fontSize: "2.2rem",
            margin: 0
          }}
        >
          Money<span style={{ color: "#0056b3" }}>Mate</span>
        </h1>
        <button
          className="toggle-dark-btn"
          onClick={() => setDarkMode(dm => !dm)}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          style={{
            background: darkMode ? "#232a36" : "#e7f1ff",
            border: `2px solid ${darkMode ? "#3399ff" : "#007bff"}`,
            cursor: "pointer",
            padding: "8px",
            borderRadius: "50%",
            transition: "background-color 0.3s, border 0.3s",
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {darkMode
            ? <FaSun color="#ffd700" size={28} />
            : <FaMoon color="#0056b3" size={28} />}
        </button>
      </header>
      {/* Main heading: Personal Finance Tracker */}
      <div
        style={{
          width: "100%",
          textAlign: "center",
          fontSize: "2.7rem",
          fontWeight: "bold",
          letterSpacing: "2px",
          margin: "30px 0 18px 0",
          color: "#007bff",
        }}
      >
        Personal Finance Tracker
      </div>
      {/* Remove any other MoneyMate heading here */}
      <nav className="panel-navbar">
        {user ? (
          <button
            className="nav-link logout-btn"
            onClick={onLogout}
            title="Logout"
            style={{ fontSize: "1.5em" }}
          >
            <FaSignOutAlt />
          </button>
        ) : (
          <NavLink
            to="/auth"
            className="nav-link"
            title="Login / Signup"
            style={{ fontSize: "1.5em" }}
          >
            <FaSignInAlt />
          </NavLink>
        )}

        <NavLink to="/" end className="nav-link" title="Dashboard" style={{ fontSize: "1.5em" }}>
          <FaTachometerAlt />
        </NavLink>
        <NavLink to="/transactions" className="nav-link" title="Transactions" style={{ fontSize: "1.5em" }}>
          <FaExchangeAlt />
        </NavLink>
        <NavLink to="/budget" className="nav-link" title="Budget" style={{ fontSize: "1.5em" }}>
          <FaWallet />
        </NavLink>
        <NavLink to="/reports" className="nav-link" title="Reports" style={{ fontSize: "1.5em" }}>
          <FaChartBar />
        </NavLink>
        <NavLink to="/goals" className="nav-link" title="Goals" style={{ fontSize: "1.5em" }}>
          <FaBullseye />
        </NavLink>
      </nav>
      {user && (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: "16px 0 0 40px",
            color: "#007bff",
            fontWeight: 600,
            fontSize: "1.5rem",
          }}
        >
          Hello, {user.name || user.email}
        </div>
      )}
      <div style={{ padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}
