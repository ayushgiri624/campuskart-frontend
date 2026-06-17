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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      <p style={{ color: "#6b7280", fontSize: "16px" }}>Loading product...</p>
    </div>
  );

  if (!product) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif", padding: "20px" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "44px" }}>😕</p>
        <h3 style={{ color: "#374151" }}>Product not found</h3>
        <Link to="/" style={{ color: "#2563eb" }}>← Back to Home</Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "'Segoe UI', sans-serif" }}>

      <nav style={{ background: "#2563eb", padding: isMobile ? "0 16px" : "0 40px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ color: "white", fontSize: isMobile ? "16px" : "20px", fontWeight: "700", textDecoration: "none" }}>🎓 CampusKart</Link>
        <Link to="/" style={{ color: "white", border: "1px solid white", padding: isMobile ? "6px 12px" : "7px 16px", borderRadius: "8px", textDecoration: "none", fontSize: isMobile ? "12px" : "14px" }}>
          ← {isMobile ? "Back" : "Back to Home"}
        </Link>
      </nav>

      <div style={{ maxWidth: "1000px", margin: isMobile ? "16px auto" : "40px auto", padding: isMobile ? "0 12px" : "0 24px" }}>
        <div style={{ background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", display: "flex", flexWrap: "wrap" }}>

          <div style={{ flex: "1", minWidth: isMobile ? "100%" : "300px" }}>
            <img src={product.image} alt={product.title}
              style={{ width: "100%", height: isMobile ? "240px" : "400px", objectFit: "cover" }}
              onError={e => { e.target.src = "https://via.placeholder.com/400x400?text=" + product.title; }} />
          </div>

          <div style={{ flex: "1", minWidth: isMobile ? "100%" : "300px", padding: isMobile ? "20px" : "40px" }}>
            <span style={{ background: "#eff6ff", color: "#2563eb", fontSize: "12px", padding: "4px 12px", borderRadius: "50px", fontWeight: "600" }}>{product.category}</span>
            <h1 style={{ fontSize: isMobile ? "22px" : "28px", fontWeight: "700", color: "#111827", margin: "14px 0 8px" }}>{product.title}</h1>
            <p style={{ color: "#6b7280", fontSize: isMobile ? "14px" : "15px", lineHeight: "1.7", marginBottom: "20px" }}>{product.description}</p>
            <h2 style={{ color: "#16a34a", fontSize: isMobile ? "26px" : "32px", fontWeight: "800", marginBottom: "20px" }}>₹{Number(product.price).toLocaleString()}</h2>

            <div style={{ background: "#f9fafb", borderRadius: "12px", padding: isMobile ? "14px" : "20px", marginBottom: "20px" }}>
              <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px", fontWeight: "600" }}>SELLER DETAILS</p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "14px", flexShrink: 0 }}>
                  {product.sellerName ? product.sellerName[0].toUpperCase() : "S"}
                </div>
                <div>
                  <p style={{ fontWeight: "600", color: "#111827", margin: 0, fontSize: "14px" }}>{product.sellerName || "Anonymous"}</p>
                  <p style={{ color: "#6b7280", fontSize: "12px", margin: 0, wordBreak: "break-all" }}>{product.sellerEmail || ""}</p>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <a href={`mailto:${product.sellerEmail}?subject=Interested in ${product.title}&body=Hi, I am interested in your product "${product.title}" listed for ₹${product.price} on CampusKart.`}
                style={{ flex: 1, minWidth: isMobile ? "100%" : "auto", background: "#2563eb", color: "white", padding: "13px", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px", textAlign: "center" }}>
                📧 Email Seller
              </a>
              <a href={`https://wa.me/${product.sellerWhatsapp || ""}?text=Hi, I am interested in your product "${product.title}" listed for ₹${product.price} on CampusKart.`}
                target="_blank" rel="noreferrer"
                style={{ flex: 1, minWidth: isMobile ? "100%" : "auto", background: "#16a34a", color: "white", padding: "13px", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px", textAlign: "center" }}>
                💬 WhatsApp
              </a>
            </div>

            {isOwner && (
              <button onClick={handleDelete} disabled={deleting}
                style={{ width: "100%", marginTop: "14px", background: deleting ? "#fca5a5" : "#ef4444", color: "white", padding: "12px", borderRadius: "8px", border: "none", fontSize: "14px", fontWeight: "600", cursor: deleting ? "not-allowed" : "pointer" }}>
                {deleting ? "Deleting..." : "🗑️ Delete My Listing"}
              </button>
            )}

            <p style={{ color: "#9ca3af", fontSize: "12px", marginTop: "14px", textAlign: "center" }}>
              Listed on {new Date(product.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      <div style={{ background: "#1e3a8a", color: "white", textAlign: "center", padding: "20px", marginTop: "32px" }}>
        <p style={{ margin: 0, fontSize: "13px" }}>© 2026 CampusKart | Developed by <strong>Ayush Giri</strong></p>
      </div>

    </div>
  );
}