import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import axios from "axios";

const API = "https://campuskart-backend-u4gf.onrender.com";
const categories = ["All", "Electronics", "Books", "Furniture", "Transport", "Services", "Other"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
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

  const avatarSrc = user
    ? user.photoURL
      ? user.photoURL + "?sz=100"
      : "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.displayName || user.email) + "&background=1d4ed8&color=fff&size=100"
    : "";

  const filtered = products
    .filter(p =>
      (activeCategory === "All" || p.category === activeCategory) &&
      (p.title.toLowerCase().includes(search.toLowerCase()) ||
       (p.description || "").toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      return new Date(b.createdAt) - new Date(a.createdAt); // newest
    });

  const getCategoryCount = (cat) =>
    cat === "All" ? products.length : products.filter(p => p.category === cat).length;

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Navbar */}
      <nav style={{ background: "#2563eb", padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
        <span style={{ color: "white", fontSize: "22px", fontWeight: "700" }}>🎓 CampusKart</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search products..."
          style={{ padding: "8px 16px", borderRadius: "8px", border: "none", width: "280px", fontSize: "14px", outline: "none" }} />
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {user ? (
            <>
              <Link to="/add-product"
                style={{ background: "white", color: "#2563eb", padding: "7px 16px", borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: "700" }}>
                + Sell
              </Link>
              <img src={avatarSrc} alt="avatar" referrerPolicy="no-referrer"
                style={{ width: "36px", height: "36px", borderRadius: "50%", border: "2px solid white", objectFit: "cover" }} />
              <span style={{ color: "white", fontSize: "14px", fontWeight: "500" }}>
                {user.displayName ? user.displayName.split(" ")[0] : user.email.split("@")[0]}
              </span>
              <button onClick={() => signOut(auth)}
                style={{ background: "transparent", color: "white", padding: "7px 16px", borderRadius: "8px", border: "1px solid white", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: "white", border: "1px solid white", padding: "8px 16px", borderRadius: "8px", textDecoration: "none", fontSize: "14px" }}>Login</Link>
              <Link to="/signup" style={{ background: "white", color: "#2563eb", padding: "8px 16px", borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #1d4ed8, #2563eb)", color: "white", textAlign: "center", padding: "60px 20px" }}>
        <h1 style={{ fontSize: "42px", fontWeight: "800", marginBottom: "12px" }}>Student Marketplace</h1>
        <p style={{ fontSize: "18px", opacity: 0.85, marginBottom: "24px" }}>Buy & sell within your campus — books, gadgets, furniture and more</p>
        {user ? (
          <Link to="/add-product" style={{ background: "white", color: "#2563eb", padding: "12px 28px", borderRadius: "50px", textDecoration: "none", fontWeight: "700", fontSize: "15px" }}>
            + List a Product →
          </Link>
        ) : (
          <Link to="/signup" style={{ background: "white", color: "#2563eb", padding: "12px 28px", borderRadius: "50px", textDecoration: "none", fontWeight: "700", fontSize: "15px" }}>
            Get Started →
          </Link>
        )}
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>

        {/* Category Filter */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              style={{
                padding: "8px 18px", borderRadius: "50px", fontSize: "13px", cursor: "pointer", border: "1px solid",
                background: activeCategory === cat ? "#2563eb" : "white",
                color: activeCategory === cat ? "white" : "#555",
                borderColor: activeCategory === cat ? "#2563eb" : "#e5e7eb",
                fontWeight: activeCategory === cat ? "600" : "400",
              }}>
              {cat} <span style={{ opacity: 0.7, fontSize: "11px" }}>({getCategoryCount(cat)})</span>
            </button>
          ))}
        </div>

        {/* Sort + Results count row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#374151", margin: 0 }}>
            {loading ? "Loading..." : `${filtered.length} product${filtered.length !== 1 ? "s" : ""} found`}
          </h3>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none", background: "white", cursor: "pointer" }}>
            <option value="newest">🕐 Newest First</option>
            <option value="price_asc">💰 Price: Low to High</option>
            <option value="price_desc">💰 Price: High to Low</option>
          </select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <p style={{ textAlign: "center", color: "#6b7280", fontSize: "18px", padding: "60px" }}>Loading products...</p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ fontSize: "48px" }}>📦</p>
            <h3 style={{ color: "#374151", fontSize: "20px" }}>No products found</h3>
            <p style={{ color: "#6b7280" }}>Try a different search or category</p>
            <Link to="/add-product" style={{ background: "#2563eb", color: "white", padding: "12px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: "600", display: "inline-block", marginTop: "16px" }}>+ Add Product</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "24px" }}>
            {filtered.map(product => (
              <Link key={product._id} to={`/product/${product._id}`} style={{ textDecoration: "none" }}>
                <div
                  style={{ background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", transition: "transform 0.2s, box-shadow 0.2s", height: "100%" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"; }}
                >
                  <div style={{ position: "relative" }}>
                    <img src={product.image} alt={product.title}
                      style={{ width: "100%", height: "180px", objectFit: "cover" }}
                      onError={e => { e.target.src = "https://via.placeholder.com/400x200?text=" + encodeURIComponent(product.title); }} />
                    <span style={{ position: "absolute", top: "10px", left: "10px", background: "#2563eb", color: "white", fontSize: "11px", padding: "3px 10px", borderRadius: "50px", fontWeight: "600" }}>
                      {product.category}
                    </span>
                  </div>
                  <div style={{ padding: "16px" }}>
                    <h4 style={{ margin: "0 0 6px", color: "#111827", fontWeight: "600", fontSize: "15px", lineHeight: "1.4" }}>{product.title}</h4>
                    <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "12px", lineHeight: "1.5",
                      overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                      {product.description || "No description provided"}
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#16a34a", fontWeight: "700", fontSize: "18px" }}>₹{Number(product.price).toLocaleString()}</span>
                      <span style={{ color: "#9ca3af", fontSize: "12px" }}>
                        {new Date(product.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                    <div style={{ marginTop: "10px", fontSize: "12px", color: "#6b7280" }}>
                      👤 {product.sellerName || "Anonymous"}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ background: "#1e3a8a", color: "white", textAlign: "center", padding: "24px", marginTop: "40px" }}>
        <p style={{ margin: 0, fontSize: "14px" }}>© 2026 CampusKart | Developed by <strong>Ayush Giri</strong></p>
      </div>

    </div>
  );
}