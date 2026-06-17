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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      <nav style={{ background: "#2563eb", padding: isMobile ? "0 16px" : "0 32px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ color: "white", fontSize: isMobile ? "16px" : "22px", fontWeight: "700", textDecoration: "none" }}>🎓 CampusKart</Link>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Link to="/add-product" style={{ background: "white", color: "#2563eb", padding: isMobile ? "6px 12px" : "7px 16px", borderRadius: "8px", textDecoration: "none", fontSize: isMobile ? "12px" : "14px", fontWeight: "700" }}>+ Sell</Link>
          <button onClick={() => signOut(auth).then(() => navigate("/"))}
            style={{ background: "transparent", color: "white", padding: isMobile ? "6px 12px" : "7px 16px", borderRadius: "8px", border: "1px solid white", fontSize: isMobile ? "12px" : "14px", cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: "900px", margin: isMobile ? "20px auto" : "40px auto", padding: isMobile ? "0 14px" : "0 24px" }}>

        {/* Profile Card */}
        {user && (
          <div style={{
            background: "white", borderRadius: "16px", padding: isMobile ? "20px" : "32px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)", display: "flex",
            alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? "14px" : "24px",
            marginBottom: isMobile ? "20px" : "32px", flexWrap: "wrap",
            flexDirection: isMobile ? "column" : "row"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", width: isMobile ? "100%" : "auto" }}>
              <img src={avatarSrc} alt="avatar" referrerPolicy="no-referrer"
                style={{ width: isMobile ? "60px" : "80px", height: isMobile ? "60px" : "80px", borderRadius: "50%", border: "3px solid #2563eb", objectFit: "cover", flexShrink: 0 }} />
              <div>
                <h2 style={{ fontSize: isMobile ? "18px" : "24px", fontWeight: "700", color: "#111827", margin: "0 0 4px" }}>
                  {user.displayName || "User"}
                </h2>
                <p style={{ color: "#6b7280", fontSize: isMobile ? "12px" : "14px", margin: "0 0 4px", wordBreak: "break-all" }}>📧 {user.email}</p>
                <p style={{ color: "#6b7280", fontSize: isMobile ? "11px" : "13px", margin: 0 }}>
                  🗓️ Joined {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "recently"}
                </p>
              </div>
            </div>
            <div style={{
              background: "#eff6ff", borderRadius: "12px", padding: isMobile ? "10px 20px" : "16px 24px",
              textAlign: "center", width: isMobile ? "100%" : "auto"
            }}>
              <p style={{ fontSize: isMobile ? "24px" : "32px", fontWeight: "800", color: "#2563eb", margin: 0 }}>{products.length}</p>
              <p style={{ fontSize: isMobile ? "12px" : "13px", color: "#6b7280", margin: 0 }}>Active Listings</p>
            </div>
          </div>
        )}

        {/* My Listings */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <h3 style={{ fontSize: isMobile ? "17px" : "20px", fontWeight: "700", color: "#111827", margin: 0 }}>My Listings</h3>
          <Link to="/add-product"
            style={{ background: "#2563eb", color: "white", padding: isMobile ? "7px 16px" : "8px 20px", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>
            + New Listing
          </Link>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "#6b7280", padding: "40px" }}>Loading your listings...</p>
        ) : products.length === 0 ? (
          <div style={{ background: "white", borderRadius: "16px", padding: isMobile ? "40px 20px" : "60px", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
            <p style={{ fontSize: "44px" }}>📦</p>
            <h3 style={{ color: "#374151", fontSize: "16px" }}>No listings yet</h3>
            <p style={{ color: "#6b7280", marginBottom: "18px", fontSize: "14px" }}>Start selling something to your campus!</p>
            <Link to="/add-product" style={{ background: "#2563eb", color: "white", padding: "11px 22px", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px" }}>
              + Add First Product
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "12px" : "16px" }}>
            {products.map(product => (
              <div key={product._id} style={{
                background: "white", borderRadius: "12px", padding: isMobile ? "14px" : "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)", display: "flex", gap: isMobile ? "12px" : "16px",
                alignItems: isMobile ? "flex-start" : "center", flexWrap: "wrap"
              }}>
                <img src={product.image} alt={product.title}
                  style={{ width: isMobile ? "60px" : "80px", height: isMobile ? "60px" : "80px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }}
                  onError={e => { e.target.src = "https://via.placeholder.com/80x80?text=No+Image"; }} />
                <div style={{ flex: 1, minWidth: isMobile ? "140px" : "160px" }}>
                  <span style={{ background: "#eff6ff", color: "#2563eb", fontSize: "10px", padding: "2px 8px", borderRadius: "50px", fontWeight: "600" }}>{product.category}</span>
                  <h4 style={{ margin: "5px 0 4px", color: "#111827", fontWeight: "600", fontSize: isMobile ? "13px" : "15px" }}>{product.title}</h4>
                  <p style={{ color: "#6b7280", fontSize: isMobile ? "11px" : "13px", margin: 0 }}>
                    {new Date(product.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, width: isMobile ? "100%" : "auto" }}>
                  <p style={{ color: "#16a34a", fontWeight: "700", fontSize: isMobile ? "15px" : "18px", margin: "0 0 8px" }}>₹{Number(product.price).toLocaleString()}</p>
                  <div style={{ display: "flex", gap: "8px", justifyContent: isMobile ? "flex-end" : "flex-start" }}>
                    <Link to={`/product/${product._id}`}
                      style={{ background: "#eff6ff", color: "#2563eb", padding: "6px 14px", borderRadius: "6px", textDecoration: "none", fontSize: "12px", fontWeight: "600" }}>
                      View
                    </Link>
                    <button onClick={() => handleDelete(product._id)} disabled={deletingId === product._id}
                      style={{ background: deletingId === product._id ? "#fca5a5" : "#fef2f2", color: "#ef4444", padding: "6px 14px", borderRadius: "6px", border: "1px solid #fecaca", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                      {deletingId === product._id ? "..." : "🗑️ Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ background: "#1e3a8a", color: "white", textAlign: "center", padding: "20px", marginTop: "32px" }}>
        <p style={{ margin: 0, fontSize: "13px" }}>© 2026 CampusKart | Developed by <strong>Ayush Giri</strong></p>
      </div>

    </div>
  );
}