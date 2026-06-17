import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase";

const API = "https://campuskart-backend-u4gf.onrender.com";
const CLOUD_NAME = "dmqiyume7";
const UPLOAD_PRESET = "campuskart_uploads";
const categories = ["Electronics", "Books", "Furniture", "Transport", "Services", "Other"];

export default function AddProduct() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [whatsapp, setWhatsapp] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) navigate("/login");
    });
    return () => unsub();
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const uploadToCloudinary = async () => {
    if (!imageFile) return "";
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", UPLOAD_PRESET);

    setUploading(true);
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      setUploading(false);
      if (!res.ok) {
        throw new Error(data.error?.message || "Image upload failed.");
      }
      return data.secure_url;
    } catch (err) {
      setUploading(false);
      throw new Error(err.message || "Image upload failed.");
    }
  };

  const handleSubmit = async () => {
    setError("");
    if (!title.trim()) { setError("Product title is required."); return; }
    if (!price || Number(price) <= 0) { setError("Please enter a valid price."); return; }
    if (!auth.currentUser) { navigate("/login"); return; }

    setLoading(true);
    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadToCloudinary();
      }

      await axios.post(`${API}/api/products`, {
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        category,
        image: imageUrl,
        sellerName: auth.currentUser.displayName || auth.currentUser.email,
        sellerEmail: auth.currentUser.email,
        sellerWhatsapp: whatsapp.trim(),
      });

      setSuccess(true);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.message || "Failed to add product. Please try again.");
    }
    setLoading(false);
  };

  const inputStyle = {
    display: "block", width: "100%", padding: isMobile ? "9px 12px" : "10px 14px",
    marginTop: "6px", marginBottom: isMobile ? "14px" : "18px", borderRadius: "8px",
    border: "1px solid #e5e7eb", fontSize: "14px", outline: "none",
    boxSizing: "border-box", fontFamily: "'Segoe UI', sans-serif",
  };
  const labelStyle = { fontSize: "13px", fontWeight: "600", color: "#374151" };

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "'Segoe UI', sans-serif" }}>
      <nav style={{ background: "#2563eb", padding: isMobile ? "0 16px" : "0 40px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ color: "white", fontSize: isMobile ? "16px" : "20px", fontWeight: "700", textDecoration: "none" }}>🎓 CampusKart</Link>
        <Link to="/" style={{ color: "white", border: "1px solid white", padding: isMobile ? "6px 12px" : "7px 16px", borderRadius: "8px", textDecoration: "none", fontSize: isMobile ? "12px" : "14px" }}>
          ← {isMobile ? "Back" : "Back to Home"}
        </Link>
      </nav>

      <div style={{ maxWidth: "600px", margin: isMobile ? "20px auto" : "40px auto", padding: isMobile ? "0 14px" : "0 24px" }}>
        <div style={{ background: "white", borderRadius: "16px", padding: isMobile ? "22px" : "40px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <h2 style={{ fontSize: isMobile ? "21px" : "26px", fontWeight: "700", color: "#111827", marginBottom: "6px" }}>Sell a Product</h2>
          <p style={{ color: "#6b7280", marginBottom: isMobile ? "20px" : "28px", fontSize: "13px" }}>Fill in the details to list your product</p>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", marginBottom: "18px" }}>
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", marginBottom: "18px" }}>
              ✅ Product listed successfully! Redirecting...
            </div>
          )}

          <label style={labelStyle}>Product Title *</label>
          <input type="text" placeholder="e.g. Engineering Books Set" value={title}
            onChange={e => setTitle(e.target.value)} style={inputStyle} />

          <label style={labelStyle}>Description</label>
          <textarea placeholder="Describe your product — condition, age, specs..." value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ ...inputStyle, height: "90px", resize: "vertical" }} />

          <label style={labelStyle}>Price (₹) *</label>
          <input type="number" placeholder="e.g. 500" value={price}
            onChange={e => setPrice(e.target.value)} style={inputStyle} min="0" />

          <label style={labelStyle}>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <label style={labelStyle}>WhatsApp Number (optional)</label>
          <input type="tel" placeholder="e.g. 9876543210" value={whatsapp}
            onChange={e => setWhatsapp(e.target.value)} style={inputStyle} maxLength={10} />

          {/* Image Upload */}
          <label style={labelStyle}>Product Image</label>
          <div
            onClick={() => document.getElementById("imageInput").click()}
            style={{
              marginTop: "6px", marginBottom: "16px", border: "2px dashed #e5e7eb",
              borderRadius: "8px", padding: isMobile ? "18px" : "24px", textAlign: "center",
              cursor: "pointer", background: "#f9fafb", transition: "border-color 0.2s"
            }}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="preview"
                style={{ width: "100%", height: isMobile ? "160px" : "200px", objectFit: "cover", borderRadius: "6px" }} />
            ) : (
              <>
                <p style={{ fontSize: "28px", margin: "0 0 6px" }}>📷</p>
                <p style={{ color: "#6b7280", fontSize: "13px", margin: 0 }}>Tap to upload an image</p>
                <p style={{ color: "#9ca3af", fontSize: "11px", margin: "4px 0 0" }}>JPG, PNG up to 5MB</p>
              </>
            )}
          </div>
          <input id="imageInput" type="file" accept="image/*"
            onChange={handleImageChange} style={{ display: "none" }} />

          {imagePreview && (
            <button onClick={() => { setImageFile(null); setImagePreview(""); }}
              style={{ background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", padding: "6px 14px", borderRadius: "6px", fontSize: "12px", cursor: "pointer", marginBottom: "16px" }}>
              ✕ Remove Image
            </button>
          )}

          {auth.currentUser && (
            <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "10px 14px", marginBottom: "20px", fontSize: "12px", color: "#6b7280" }}>
              📧 Listing as: <strong style={{ color: "#111827" }}>{auth.currentUser.displayName || auth.currentUser.email}</strong>
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading || uploading || success}
            style={{
              width: "100%",
              background: success ? "#16a34a" : loading || uploading ? "#93c5fd" : "#2563eb",
              color: "white", padding: "12px", borderRadius: "8px", border: "none",
              fontSize: "15px", fontWeight: "600",
              cursor: loading || uploading || success ? "not-allowed" : "pointer"
            }}>
            {success ? "✅ Listed!" : uploading ? "⬆️ Uploading Image..." : loading ? "Adding Product..." : "List Product"}
          </button>
        </div>
      </div>
    </div>
  );
}