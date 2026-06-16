import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import axios from "axios";

const API = "https://campuskart-backend-u4gf.onrender.com";
const categories = ["All", "Electronics", "Books", "Furniture", "Transport", "Services"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    axios.get(`${API}/api/products`)
      .then(res => { setProducts(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = products.filter(p =>
    (activeCategory === "All" || p.category === activeCategory) &&
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const avatarSrc = user
    ? user.photoURL
      ? user.photoURL + "?sz=100"
      : "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.displayName || user.email) + "&background=1d4ed8&color=fff&size=100"
    : "";

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Navbar */}
      <nav style={{ background: "#2563eb", padding: "0 40px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
        <span style={{ color: "white", fontSize: "22px", fontWeight: "700" }}>🎓 CampusKart</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
          style={{ padding: "8px 16px", borderRadius: "8px", border: "none", width: "280px", fontSize: "14px", outline: "none" }} />
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {user ? (
            <>
              <img src={avatarSrc} alt="avatar" referrerPolicy="no-referrer"
                style={{ width: "36px", height: "36px", borderRadius: "50%", border: "2px solid white", objectFit: "cover" }} />
              <span style={{ color: "white", fontSize: "14px", fontWeight: "500" }}>{user.displayName || user.email}</span>
              <button onClick={() => signOut(auth)}
                style={{ background: "white", color: "#2563eb", padding: "7px 16px", borderRadius: "8px", border: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: "white", border: "1px solid white", padding: "8px 16px", borderRadius: "8px", textDecoration: "none", fontSize: "14px" }}>Login</Link>
              <Link to="/add-product" style={{ background: "white", color: "#2563eb", padding: "8px 16px", borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>+ Sell</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #1d4ed8, #2563eb)", color: "white", textAlign: "center", padding: "60px 20px" }}>
        <h1 style={{ fontSize: "42px", fontWeight: "800", marginBottom: "12px" }}>Student Marketplace</h1>
        <p style={{ fontSize: "18px", opacity: 0.85, marginBottom: "24px" }}>Buy & sell within your campus — books, gadgets, furniture and more</p>
        <Link to="/add-product" style={{ background: "white", color: "#2563eb", padding: "12px 28px", borderRadius: "50px", textDecoration: "none", fontWeight: "700", fontSize: "15px" }}>
          Start Selling →
        </Link>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "32px" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              style={{
                padding: "8px 18px", borderRadius: "50px", fontSize: "14px", cursor: "pointer", border: "1px solid",
                background: activeCategory === cat ? "#2563eb" : "white",
                color: activeCategory === cat ? "white" : "#555",
                borderColor: activeCategory === cat ? "#2563eb" : "#e5e7eb",
                fontWeight: activeCategory === cat ? "600" : "400",
              }}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "#6b7280", fontSize: "18px", padding: "60px" }}>Loading products...</p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ fontSize: "48px" }}>📦</p>
            <h3 style={{ color: "#374151", fontSize: "20px" }}>No products yet</h3>
            <p style={{ color: "#6b7280" }}>Be the first to sell something!</p>
            <Link to="/add-product" style={{ background: "#2563eb", color: "white", padding: "12px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: "600", display: "inline-block", marginTop: "16px" }}>+ Add Product</Link>
          </div>
        ) : (
          <>
            <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#374151", marginBottom: "20px" }}>
              {filtered.length} Products Available
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "24px" }}>
              {filtered.map(product => (
                <Link key={product._id} to={`/product/${product._id}`} style={{ textDecoration: "none" }}>
                  <div
                    style={{ background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", transition: "transform 0.2s, box-shadow 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"; }}
                  >
                    <img src={product.image} alt={product.title} style={{ width: "100%", height: "200px", objectFit: "cover" }}
                      onError={e => { e.target.src = "https://via.placeholder.com/400x200?text=" + product.title; }} />
                    <div style={{ padding: "16px" }}>
                      <span style={{ background: "#eff6ff", color: "#2563eb", fontSize: "11px", padding: "3px 10px", borderRadius: "50px", fontWeight: "600" }}>{product.category}</span>
                      <h4 style={{ margin: "10px 0 6px", color: "#111827", fontWeight: "600", fontSize: "16px" }}>{product.title}</h4>
                      <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "12px", lineHeight: "1.5" }}>{product.description}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: "#16a34a", fontWeight: "700", fontSize: "18px" }}>₹{Number(product.price).toLocaleString()}</span>
                        <button style={{ background: "#2563eb", color: "white", border: "none", padding: "7px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>View</button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{ background: "#1e3a8a", color: "white", textAlign: "center", padding: "24px", marginTop: "40px" }}>
        <p style={{ margin: 0, fontSize: "14px" }}>© 2026 CampusKart | Developed by <strong>Ayush Giri</strong></p>
      </div>

    </div>
  );
}