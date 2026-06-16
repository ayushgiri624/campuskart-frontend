import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const API = "https://campuskart-backend-u4gf.onrender.com";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    axios.get(`${API}/api/products/${id}`)
      .then(res => { setProduct(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setDeleting(true);
    try {
      await axios.delete(`${API}/api/products/${id}`);
      navigate("/");
    } catch (err) {
      alert("Failed to delete. Try again.");
      setDeleting(false);
    }
  };

  const isOwner = user && product && user.email === product.sellerEmail;

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif" }}>
      <p style={{ color: "#6b7280", fontSize: "18px" }}>Loading product...</p>
    </div>
  );

  if (!product) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "48px" }}>😕</p>
        <h3 style={{ color: "#374151" }}>Product not found</h3>
        <Link to="/" style={{ color: "#2563eb" }}>← Back to Home</Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "'Segoe UI', sans-serif" }}>

      <nav style={{ background: "#2563eb", padding: "0 40px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ color: "white", fontSize: "20px", fontWeight: "700", textDecoration: "none" }}>🎓 CampusKart</Link>
        <Link to="/" style={{ color: "white", border: "1px solid white", padding: "7px 16px", borderRadius: "8px", textDecoration: "none", fontSize: "14px" }}>← Back to Home</Link>
      </nav>

      <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 24px" }}>
        <div style={{ background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", display: "flex", flexWrap: "wrap" }}>

          <div style={{ flex: "1", minWidth: "300px" }}>
            <img src={product.image} alt={product.title}
              style={{ width: "100%", height: "400px", objectFit: "cover" }}
              onError={e => { e.target.src = "https://via.placeholder.com/400x400?text=" + product.title; }} />
          </div>

          <div style={{ flex: "1", minWidth: "300px", padding: "40px" }}>
            <span style={{ background: "#eff6ff", color: "#2563eb", fontSize: "12px", padding: "4px 12px", borderRadius: "50px", fontWeight: "600" }}>{product.category}</span>
            <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#111827", margin: "16px 0 8px" }}>{product.title}</h1>
            <p style={{ color: "#6b7280", fontSize: "15px", lineHeight: "1.7", marginBottom: "24px" }}>{product.description}</p>
            <h2 style={{ color: "#16a34a", fontSize: "32px", fontWeight: "800", marginBottom: "24px" }}>₹{Number(product.price).toLocaleString()}</h2>

            <div style={{ background: "#f9fafb", borderRadius: "12px", padding: "20px", marginBottom: "24px" }}>
              <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "8px", fontWeight: "600" }}>SELLER DETAILS</p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "16px" }}>
                  {product.sellerName ? product.sellerName[0].toUpperCase() : "S"}
                </div>
                <div>
                  <p style={{ fontWeight: "600", color: "#111827", margin: 0 }}>{product.sellerName || "Anonymous"}</p>
                  <p style={{ color: "#6b7280", fontSize: "13px", margin: 0 }}>{product.sellerEmail || ""}</p>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a href={`mailto:${product.sellerEmail}?subject=Interested in ${product.title}&body=Hi, I am interested in your product "${product.title}" listed for ₹${product.price} on CampusKart.`}
                style={{ flex: 1, background: "#2563eb", color: "white", padding: "14px", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "15px", textAlign: "center" }}>
                📧 Email Seller
              </a>
              <a href={`https://wa.me/${product.sellerWhatsapp || ""}?text=Hi, I am interested in your product "${product.title}" listed for ₹${product.price} on CampusKart.`}
                target="_blank" rel="noreferrer"
                style={{ flex: 1, background: "#16a34a", color: "white", padding: "14px", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "15px", textAlign: "center" }}>
                💬 WhatsApp
              </a>
            </div>

            {/* Delete button — only for the seller */}
            {isOwner && (
              <button onClick={handleDelete} disabled={deleting}
                style={{ width: "100%", marginTop: "16px", background: deleting ? "#fca5a5" : "#ef4444", color: "white", padding: "12px", borderRadius: "8px", border: "none", fontSize: "15px", fontWeight: "600", cursor: deleting ? "not-allowed" : "pointer" }}>
                {deleting ? "Deleting..." : "🗑️ Delete My Listing"}
              </button>
            )}

            <p style={{ color: "#9ca3af", fontSize: "12px", marginTop: "16px", textAlign: "center" }}>
              Listed on {new Date(product.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      <div style={{ background: "#1e3a8a", color: "white", textAlign: "center", padding: "24px", marginTop: "40px" }}>
        <p style={{ margin: 0, fontSize: "14px" }}>© 2026 CampusKart | Developed by <strong>Ayush Giri</strong></p>
      </div>

    </div>
  );
}