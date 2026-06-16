import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  const handleGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
    navigate("/");
  } catch (err) {
    console.error("Google error:", err.code, err.message);
    if (err.code === "auth/popup-blocked") {
      setError("Popup was blocked. Please allow popups for this site and try again.");
    } else if (err.code === "auth/popup-closed-by-user") {
      setError("Sign-in cancelled. Please try again.");
    } else {
      setError(`Google sign-in failed: ${err.code}`);
    }
  }
};

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", display: "flex", flexDirection: "column", fontFamily: "'Segoe UI', sans-serif" }}>
      <nav style={{ background: "#2563eb", padding: "0 40px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ color: "white", fontSize: "20px", fontWeight: "700", textDecoration: "none" }}>🎓 CampusKart</Link>
        <Link to="/signup" style={{ color: "white", border: "1px solid white", padding: "7px 16px", borderRadius: "8px", textDecoration: "none", fontSize: "14px" }}>Create Account</Link>
      </nav>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ background: "white", borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "420px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <h2 style={{ fontSize: "26px", fontWeight: "700", color: "#111827", marginBottom: "6px" }}>Welcome back</h2>
          <p style={{ color: "#6b7280", marginBottom: "28px", fontSize: "14px" }}>Login to your CampusKart account</p>

          {error && <p style={{ color: "red", fontSize: "13px", marginBottom: "16px" }}>{error}</p>}

          <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Email</label>
          <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}
            style={{ display: "block", width: "100%", padding: "10px 14px", marginTop: "6px", marginBottom: "18px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />

          <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Password</label>
          <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
            style={{ display: "block", width: "100%", padding: "10px 14px", marginTop: "6px", marginBottom: "24px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />

          <button onClick={handleLogin}
            style={{ width: "100%", background: "#2563eb", color: "white", padding: "12px", borderRadius: "8px", border: "none", fontSize: "15px", fontWeight: "600", cursor: "pointer", marginBottom: "12px" }}>
            Login
          </button>

          <button onClick={handleGoogle}
            style={{ width: "100%", background: "white", color: "#374151", padding: "12px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "15px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <img src="https://www.google.com/favicon.ico" alt="google" style={{ width: "18px" }} />
            Continue with Google
          </button>

          <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#6b7280" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "#2563eb", fontWeight: "600", textDecoration: "none" }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}