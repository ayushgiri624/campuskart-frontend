import React, { useState, useEffect } from "react";
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
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  // Redirect to login if not logged in
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) navigate("/login");
    });
    return () => unsub();
  }, [navigate]);

  const handleSubmit = async () => {
    setError("");
    if (!title.trim()) { setError("Product title is required."); return; }
    if (!price || Number(price) <= 0) { setError("Please enter a valid price."); return; }
    if (!auth.currentUser) { navigate("/login"); return; }

    setLoading(true);
    try {
      await axios.post(`${API}/api/products`, {
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        category,
        image: image.trim(),
        sellerName: auth.currentUser.displayName || auth.currentUser.email,
        sellerEmail: auth.currentUser.email,
        sellerWhatsapp: whatsapp.trim(),
      });
      setSuccess(true);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError("Failed to add product. Please try again.");
    }
    setLoading(false);
  };

  const inputStyle = {
    display: "block", width: "100%", padding: "10px 14px",
    marginTop: "6px", marginBottom: "18px", borderRadius: "8px",
    border: "1px solid #e5e7eb", fontSize: "14px", outline: "none",
    boxSizing: "border-box", fontFamily: "'Segoe UI', sans-serif",
  };
  const labelStyle = { fontSize: "13px", fontWeight: "600", color: "#374151" };

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Navbar */}
      <nav style={{ background: "#2563eb", padding: "0 40px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ color: "white", fontSize: "20px", fontWeight: "700", textDecoration: "none" }}>🎓 CampusKart</Link>
        <Link to="/" style={{ color: "white", border: "1px solid white", padding: "7px 16px", borderRadius: "8px", textDecoration: "none", fontSize: "14px" }}>← Back to Home</Link>
      </nav>

      <div style={{ maxWidth: "600px", margin: "40px auto", padding: "0 24px" }}>
        <div style={{ background: "white", borderRadius: "16px", padding: "40px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <h2 style={{ fontSize: "26px", fontWeight: "700", color: "#111827", marginBottom: "6px" }}>Sell a Product</h2>
          <p style={{ color: "#6b7280", marginBottom: "28px", fontSize: "14px" }}>Fill in the details to list your product</p>

          {/* Error */}
          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", marginBottom: "18px" }}>
              ⚠️ {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", marginBottom: "18px" }}>
              ✅ Product listed successfully! Redirecting...
            </div>
          )}

          {/* Title */}
          <label style={labelStyle}>Product Title *</label>
          <input type="text" placeholder="e.g. Engineering Books Set" value={title}
            onChange={e => setTitle(e.target.value)} style={inputStyle} />

          {/* Description */}
          <label style={labelStyle}>Description</label>
          <textarea placeholder="Describe your product — condition, age, specs..." value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ ...inputStyle, height: "100px", resize: "vertical" }} />

          {/* Price */}
          <label style={labelStyle}>Price (₹) *</label>
          <input type="number" placeholder="e.g. 500" value={price}
            onChange={e => setPrice(e.target.value)} style={inputStyle} min="0" />

          {/* Category */}
          <label style={labelStyle}>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          {/* WhatsApp */}
          <label style={labelStyle}>WhatsApp Number (optional)</label>
          <input type="tel" placeholder="e.g. 9876543210" value={whatsapp}
            onChange={e => setWhatsapp(e.target.value)} style={inputStyle} maxLength={10} />

          {/* Image URL */}
          <label style={labelStyle}>Image URL (optional)</label>
          <input type="text" placeholder="https://..." value={image}
            onChange={e => { setImage(e.target.value); setImageError(false); }} style={inputStyle} />

          {/* Image Preview */}
          {image && !imageError && (
            <img src={image} alt="preview"
              onError={() => setImageError(true)}
              style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px", marginBottom: "24px" }} />
          )}
          {image && imageError && (
            <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "-12px", marginBottom: "18px" }}>
              ⚠️ Could not load image. Please check the URL.
            </p>
          )}

          {/* Seller info (readonly display) */}
          {auth.currentUser && (
            <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "12px 16px", marginBottom: "24px", fontSize: "13px", color: "#6b7280" }}>
              📧 Listing as: <strong style={{ color: "#111827" }}>{auth.currentUser.displayName || auth.currentUser.email}</strong>
            </div>
          )}

          {/* Submit */}
          <button onClick={handleSubmit} disabled={loading || success}
            style={{ width: "100%", background: success ? "#16a34a" : loading ? "#93c5fd" : "#2563eb", color: "white", padding: "12px", borderRadius: "8px", border: "none", fontSize: "15px", fontWeight: "600", cursor: loading || success ? "not-allowed" : "pointer", transition: "background 0.2s" }}>
            {success ? "✅ Listed!" : loading ? "Adding Product..." : "List Product"}
          </button>
        </div>
      </div>
    </div>
  );
}