import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupLogin({ setUser }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  function isValidPassword(pw) {
    return pw.length >= 8 && /[A-Z]/.test(pw);
  }

  const handleSignup = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!name || !email || !password) {
      setError("Please fill all fields.");
      return;
    }
    if (!isValidPassword(password)) {
      setError("Password must be at least 8 characters and contain at least one capital letter.");
      return;
    }
    if (localStorage.getItem(`user_${email}`)) {
      setError("User already exists. Please login.");
      return;
    }
    const user = { name, email, password };
    localStorage.setItem(`user_${email}`, JSON.stringify(user));
    setSuccess("Signup successful! Please login.");
    setIsSignup(false);
    setName("");
    setPassword("");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const stored = localStorage.getItem(`user_${email}`);
    if (!stored) {
      setError("User not found. Please sign up.");
      return;
    }
    const user = JSON.parse(stored);
    if (user.password !== password) {
      setError("Incorrect password.");
      return;
    }
    setUser(user);
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    navigate("/transactions");
  };

  return (
    <div style={{
      minHeight: "70vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(120deg, #e0eafc, #cfdef3)"
    }}>
      <div style={{
        background: "#fff",
        padding: "36px 32px",
        borderRadius: "18px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        minWidth: 340,
        maxWidth: 380
      }}>
        <h2 style={{ textAlign: "center", color: "#007bff", marginBottom: 28, fontWeight: 700 }}>
          {isSignup ? "Sign Up" : "Login"}
        </h2>
        <form
          onSubmit={isSignup ? handleSignup : handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: 18 }}
        >
          {isSignup && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontWeight: 500, marginBottom: 2 }}>Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                type="text"
                placeholder="Enter your name"
                style={{
                  padding: "10px 12px",
                  borderRadius: 6,
                  border: "1px solid #cfd8dc",
                  fontSize: "1rem"
                }}
              />
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontWeight: 500, marginBottom: 2 }}>Email</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              style={{
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid #cfd8dc",
                fontSize: "1rem"
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontWeight: 500, marginBottom: 2 }}>Password</label>
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
              style={{
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid #cfd8dc",
                fontSize: "1rem"
              }}
            />
          </div>
          {error && <div className="text-danger mb-2" style={{ textAlign: "center", fontWeight: 500 }}>{error}</div>}
          {success && <div className="text-success mb-2" style={{ textAlign: "center", fontWeight: 500 }}>{success}</div>}
          <button
            type="submit"
            style={{
              width: "100%",
              background: "linear-gradient(90deg, #007bff 60%, #0056b3 100%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.1rem",
              borderRadius: 8,
              border: "none",
              padding: "12px 0",
              marginTop: 8,
              marginBottom: 4,
              boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              letterSpacing: "1px",
              transition: "background 0.2s"
            }}
            onMouseOver={e => e.currentTarget.style.background = "#0056b3"}
            onMouseOut={e => e.currentTarget.style.background = "linear-gradient(90deg, #007bff 60%, #0056b3 100%)"}
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>
        <div className="mt-3 text-center" style={{ marginTop: 18 }}>
          {isSignup ? (
            <span>
              Already have an account?{" "}
              <button
                className="btn btn-link p-0"
                style={{ color: "#007bff", fontWeight: 500, textDecoration: "underline", background: "none", border: "none" }}
                onClick={() => { setIsSignup(false); setError(""); setSuccess(""); }}>
                Login
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{" "}
              <button
                className="btn btn-link p-0"
                style={{ color: "#007bff", fontWeight: 500, textDecoration: "underline", background: "none", border: "none" }}
                onClick={() => { setIsSignup(true); setError(""); setSuccess(""); }}>
                Sign Up
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignupLogin;
