import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
    navigate("/auth");
  };

  const baseButtonStyle = {
    backgroundColor: "#007bff",
    border: "none",
    color: "white",
    padding: "8px 18px",
    margin: "0 8px",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "none",
    userSelect: "none",
    transition: "background-color 0.3s ease, transform 0.2s ease",
    display: "inline-block",
  };

  const activeButtonStyle = {
    backgroundColor: "#0056b3", // consistent active blue
  };

  function NavButton({ to, label }) {
    const [hover, setHover] = React.useState(false);
    const isActive = location.pathname === to;

    return (
      <Link
        to={to}
        style={{
          ...baseButtonStyle,
          ...(isActive ? activeButtonStyle : {}),
          backgroundColor: hover
            ? isActive
              ? "#004494"
              : "#3399ff"
            : isActive
            ? "#0056b3"
            : "#007bff",
          transform: hover ? "scale(1.05)" : "scale(1)",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {label}
      </Link>
    );
  }

  return (
    <>
      <div
        style={{
          maxWidth: "960px",
          margin: "20px auto",
          padding: "0 15px",
          textAlign: "center",
          userSelect: "none",
        }}
      >
        <h1
          style={{
            fontSize: "2.7rem",
            fontWeight: "bold",
            letterSpacing: "2px",
            color: "#007bff",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Personal Finance Tracker
        </h1>

        <nav
          style={{
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {!user ? (
            <Link
              to="/auth"
              style={{
                ...baseButtonStyle,
                marginRight: "16px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#3399ff";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#007bff";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Login / Signup
            </Link>
          ) : (
            <button
              style={{ ...baseButtonStyle, marginRight: "16px" }}
              onClick={handleLogout}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#3399ff";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#007bff";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Logout
            </button>
          )}

          <NavButton to="/" label="Dashboard" />
          <NavButton to="/transactions" label="Transactions" />
          <NavButton to="/budget" label="Budget" />
          <NavButton to="/reports" label="Reports" />
          <NavButton to="/goals" label="Goals" />
        </nav>
      </div>
    </>
  );
}

export default Navbar;
