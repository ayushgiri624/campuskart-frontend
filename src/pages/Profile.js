import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import axios from "axios";

const API = "https://campuskart-backend-u4gf.onrender.com";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) { navigate("/login"); return; }
      setUser(u);
    });
    return () => unsub();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    axios.get(`${API}/api/products`)
      .then(res => {
        const mine = res.data.filter(p => p.sellerEmail === user.email);
        setProducts(mine);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setDeletingId(id);
    try {
      await axios.delete(`${API}/api/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch {
      alert("Failed to delete. Try again.");
    }
    setDeletingId(null);
  };

  const avatarSrc = user
    ? user.photoURL
      ? user.photoURL + "?sz=100"
      : "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.displayName || user.email) + "&background=1d4ed8&color=fff&size=100"
    : "";

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Navbar */}
      <nav style={{ background: "#2563eb", padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
        <Link to="/" style={{ color: "white", fontSize: "22px", fontWeight: "700", textDecoration: "none" }}>🎓 CampusKart</Link>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Link to="/add-product" style={{ background: "white", color: "#2563eb", padding: "7px 16px", borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: "700" }}>+ Sell</Link>
          <button onClick={() => signOut(auth).then(() => navigate("/"))}
            style={{ background: "transparent", color: "white", padding: "7px 16px", borderRadius: "8px", border: "1px solid white", fontSize: "14px", cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: "900px", margin: "40px auto", padding: "0 24px" }}>

        {/* Profile Card */}
        {user && (
          <div style={{ background: "white", borderRadius: "16px", padding: "32px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: "24px", marginBottom: "32px", flexWrap: "wrap" }}>
            <img src={avatarSrc} alt="avatar" referrerPolicy="no-referrer"
              style={{ width: "80px", height: "80px", borderRadius: "50%", border: "3px solid #2563eb", objectFit: "cover" }} />
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 4px" }}>
                {user.displayName || "User"}
              </h2>
              <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 4px" }}>📧 {user.email}</p>
              <p style={{ color: "#6b7280", fontSize: "13px", margin: 0 }}>
                🗓️ Joined {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "recently"}
              </p>
            </div>
            <div style={{ background: "#eff6ff", borderRadius: "12px", padding: "16px 24px", textAlign: "center" }}>
              <p style={{ fontSize: "32px", fontWeight: "800", color: "#2563eb", margin: 0 }}>{products.length}</p>
              <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>Active Listings</p>
            </div>
          </div>
        )}

        {/* My Listings */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#111827", margin: 0 }}>My Listings</h3>
          <Link to="/add-product"
            style={{ background: "#2563eb", color: "white", padding: "8px 20px", borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
            + New Listing
          </Link>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "#6b7280", padding: "40px" }}>Loading your listings...</p>
        ) : products.length === 0 ? (
          <div style={{ background: "white", borderRadius: "16px", padding: "60px", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
            <p style={{ fontSize: "48px" }}>📦</p>
            <h3 style={{ color: "#374151" }}>No listings yet</h3>
            <p style={{ color: "#6b7280", marginBottom: "20px" }}>Start selling something to your campus!</p>
            <Link to="/add-product" style={{ background: "#2563eb", color: "white", padding: "12px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: "600" }}>
              + Add First Product
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {products.map(product => (
              <div key={product._id} style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
                <img src={product.image} alt={product.title}
                  style={{ width: "80px", height: "80px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }}
                  onError={e => { e.target.src = "https://via.placeholder.com/80x80?text=No+Image"; }} />
                <div style={{ flex: 1, minWidth: "160px" }}>
                  <span style={{ background: "#eff6ff", color: "#2563eb", fontSize: "11px", padding: "2px 8px", borderRadius: "50px", fontWeight: "600" }}>{product.category}</span>
                  <h4 style={{ margin: "6px 0 4px", color: "#111827", fontWeight: "600", fontSize: "15px" }}>{product.title}</h4>
                  <p style={{ color: "#6b7280", fontSize: "13px", margin: 0 }}>
                    Listed on {new Date(product.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ color: "#16a34a", fontWeight: "700", fontSize: "18px", margin: "0 0 8px" }}>₹{Number(product.price).toLocaleString()}</p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Link to={`/product/${product._id}`}
                      style={{ background: "#eff6ff", color: "#2563eb", padding: "6px 14px", borderRadius: "6px", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>
                      View
                    </Link>
                    <button onClick={() => handleDelete(product._id)} disabled={deletingId === product._id}
                      style={{ background: deletingId === product._id ? "#fca5a5" : "#fef2f2", color: "#ef4444", padding: "6px 14px", borderRadius: "6px", border: "1px solid #fecaca", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                      {deletingId === product._id ? "..." : "🗑️ Delete"}
                    </button>
                  </div>
                </div>
              </div>
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