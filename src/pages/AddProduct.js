import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase";

const API = "https://campuskart-backend-u4gf.onrender.com";

const categories = ["Electronics", "Books", "Furniture", "Transport", "Services", "Other"];

export default function AddProduct() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title || !price) { setError("Title and price are required"); return; }
    if (!auth.currentUser) { setError("Please login first"); return; }

    setLoading(true);
    try {
      await axios.post(`${API}/api/products`, {
        title, description, price: Number(price), category, image,
        sellerName: auth.currentUser.displayName || auth.currentUser.email,
        sellerEmail: auth.currentUser.email,
      });
      navigate("/");
    } catch (err) {
      setError("Failed to add product. Try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "'Segoe UI', sans-serif" }}>
      <nav style={{ background: "#2563eb", padding: "0 40px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ color: "white", fontSize: "20px", fontWeight: "700", textDecoration: "none" }}>🎓 CampusKart</Link>
        <Link to="/" style={{ color: "white", border: "1px solid white", padding: "7px 16px", borderRadius: "8px", textDecoration: "none", fontSize: "14px" }}>← Back to Home</Link>
      </nav>

      <div style={{ maxWidth: "600px", margin: "40px auto", padding: "0 24px" }}>
        <div style={{ background: "white", borderRadius: "16px", padding: "40px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <h2 style={{ fontSize: "26px", fontWeight: "700", color: "#111827", marginBottom: "6px" }}>Sell a Product</h2>
          <p style={{ color: "#6b7280", marginBottom: "28px", fontSize: "14px" }}>Fill in the details to list your product</p>

          {error && <p style={{ color: "red", fontSize: "13px", marginBottom: "16px" }}>{error}</p>}

          <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Product Title *</label>
          <input type="text" placeholder="e.g. Engineering Books" value={title} onChange={e => setTitle(e.target.value)}
            style={{ display: "block", width: "100%", padding: "10px 14px", marginTop: "6px", marginBottom: "18px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />

          <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Description</label>
          <textarea placeholder="Describe your product..." value={description} onChange={e => setDescription(e.target.value)}
            style={{ display: "block", width: "100%", padding: "10px 14px", marginTop: "6px", marginBottom: "18px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box", height: "100px", resize: "vertical" }} />

          <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Price (₹) *</label>
          <input type="number" placeholder="e.g. 500" value={price} onChange={e => setPrice(e.target.value)}
            style={{ display: "block", width: "100%", padding: "10px 14px", marginTop: "6px", marginBottom: "18px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />

          <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}
            style={{ display: "block", width: "100%", padding: "10px 14px", marginTop: "6px", marginBottom: "18px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box" }}>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Image URL</label>
          <input type="text" placeholder="https://..." value={image} onChange={e => setImage(e.target.value)}
            style={{ display: "block", width: "100%", padding: "10px 14px", marginTop: "6px", marginBottom: "24px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />

          {image && <img src={image} alt="preview" style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px", marginBottom: "24px" }} />}

          <button onClick={handleSubmit} disabled={loading}
            style={{ width: "100%", background: loading ? "#93c5fd" : "#2563eb", color: "white", padding: "12px", borderRadius: "8px", border: "none", fontSize: "15px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}