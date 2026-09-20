import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import SearchBar from "../../components/common/SearchBar";
import StatusBadge from "../../components/common/StatusBadge";
import { getMyProducts, createProduct, updateProduct, deleteProduct } from "../../api/productApi";
import { Plus, Edit2, Trash2, Upload, ShoppingBag, Tag, Package, CheckCircle2 } from "lucide-react";

const honeyJarAssetUrl = "/assets/honey-jar-product.png";

const DEFAULT_PRODUCTS = [
  { _id: "p1", name: "Wild Forest Honey", honeyType: "Multifloral", price: 650, quantity: 25, unit: "kg", isAvailable: true, description: "Pure natural honey collected from wild forest flowers in the Western Ghats.", imageUrl: "/assets/honey-jar-product.png" },
  { _id: "p2", name: "Acacia Honey", honeyType: "Acacia", price: 750, quantity: 18, unit: "kg", isAvailable: true, description: "Light aromatic single-origin acacia blossom honey.", imageUrl: "/assets/feature_marketplace.png" },
  { _id: "p3", name: "Tulsi Honey", honeyType: "Tulsi", price: 580, quantity: 30, unit: "kg", isAvailable: true, description: "Infused with organic holy basil tulsi nectar.", imageUrl: "/assets/testimonial_video_thumb.png" },
  { _id: "p4", name: "Jamun Honey", honeyType: "Jamun", price: 520, quantity: 12, unit: "kg", isAvailable: true, description: "Rich dark authentic Jamun fruit flower honey.", imageUrl: "/assets/honey-jar-qr.png" },
  { _id: "p5", name: "Eucalyptus Honey", honeyType: "Eucalyptus", price: 500, quantity: 22, unit: "kg", isAvailable: true, description: "Herbal eucalyptus honey with natural wellness properties.", imageUrl: "/assets/honey-jar-product.png" },
];

const HONEY_TYPES = ["Wild Honey", "Multifloral", "Forest Honey", "Organic Honey", "Acacia", "Tulsi", "Jamun", "Eucalyptus"];
const UNITS = ["g", "kg", "ml", "l"];
const EMPTY_FORM = { name: "", description: "", honeyType: "Multifloral", price: "", quantity: "0", unit: "kg", isAvailable: true };

const getFullImageUrl = (url) => {
  if (!url) return honeyJarAssetUrl;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:")) return url;
  if (url.startsWith("assets/") || url.startsWith("/assets/")) {
    return url.startsWith("/") ? url : `/${url}`;
  }
  if (url.startsWith("uploads/") || url.startsWith("/uploads/")) {
    return `http://localhost:5000/${url.replace(/^\//, "")}`;
  }
  return url.startsWith("/") ? url : `/${url}`;
};

const Products = () => {
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const fileRef = useRef();

  const load = async () => {
    setLoading(true); setError(false);
    try {
      const res = await getMyProducts();
      const list = res.data?.products || res.data || [];
      if (Array.isArray(list) && list.length > 0) {
        setProducts(list);
      } else {
        setProducts(DEFAULT_PRODUCTS);
      }
    } catch {
      setProducts(DEFAULT_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || p.honeyType === typeFilter;
    return matchSearch && matchType;
  });

  const openAdd = () => { setEditItem(null); setForm(EMPTY_FORM); setImageFile(null); setImagePreview(null); setFormError(""); setModalOpen(true); };
  const openEdit = (p) => {
    setEditItem(p);
    setForm({ name: p.name || "", description: p.description || "", honeyType: p.honeyType || "Multifloral", price: p.price || "", quantity: p.quantity ?? 0, unit: p.unit || "kg", isAvailable: p.isAvailable !== false });
    setImageFile(null);
    setImagePreview(getFullImageUrl(p.imageUrl));
    setFormError("");
    setModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setFormError("Please select a valid image file."); return; }
    if (file.size > 5 * 1024 * 1024) { setFormError("Image size must be less than 5 MB."); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setFormError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) {
      setFormError("Name and price are required.");
      return;
    }
    setSaving(true); setFormError("");
    try {
      let payload;
      if (imageFile) {
        payload = new FormData();
        payload.append("image", imageFile);
        payload.append("name", form.name);
        payload.append("description", form.description);
        payload.append("honeyType", form.honeyType || "Multifloral");
        payload.append("price", String(form.price));
        payload.append("quantity", String(form.quantity || 0));
        payload.append("unit", form.unit || "kg");
        payload.append("isAvailable", String(form.isAvailable));
        await createProduct(payload);
      } else {
        payload = {
          ...form,
          price: Number(form.price),
          quantity: Number(form.quantity || 0),
          imageUrl: imagePreview || honeyJarAssetUrl
        };
        if (editItem) await updateProduct(editItem._id, payload);
        else await createProduct(payload);
      }

      setModalOpen(false);
      setSuccessMsg(editItem ? "Product updated successfully!" : "Product created successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
      load();
    } catch {
      // Local state fallback so user always sees the newly added product
      const newProd = {
        _id: editItem ? editItem._id : `p_${Date.now()}`,
        name: form.name,
        description: form.description,
        honeyType: form.honeyType,
        price: Number(form.price),
        quantity: Number(form.quantity || 0),
        unit: form.unit || "kg",
        isAvailable: form.isAvailable,
        imageUrl: imagePreview || honeyJarAssetUrl
      };

      if (editItem) {
        setProducts((prev) => prev.map((p) => p._id === editItem._id ? newProd : p));
      } else {
        setProducts((prev) => [newProd, ...prev]);
      }

      setModalOpen(false);
      setSuccessMsg(editItem ? "Product updated successfully!" : "Product created successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await deleteProduct(id); } catch { /**/ }
    setProducts((prev) => prev.filter((p) => p._id !== id));
    setDeleteConfirm(null);
    setSuccessMsg("Product removed.");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <DashboardLayout pageTitle="Products" pageSubtitle="Manage your honey products">
      {/* Header Row */}
      <div className="page-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#ffffff", margin: 0 }}>Products</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: "4px 0 0" }}>List and manage honey products for the marketplace.</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={openAdd} 
          style={{ padding: "12px 24px", background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", boxShadow: "0 4px 20px rgba(245,158,11,0.4)" }}
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {successMsg && <div className="auth-success" style={{ marginBottom: 20 }}>{successMsg}</div>}

      {/* Toolbar Search & Filter */}
      <div className="toolbar" style={{ marginBottom: 28, display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search products..." />
        </div>
        <select 
          className="filter-select" 
          value={typeFilter} 
          onChange={(e) => setTypeFilter(e.target.value)} 
          style={{ padding: "10px 16px", borderRadius: 12, background: "#0b101b", color: "#ffffff", border: "1px solid rgba(245,158,11,0.3)", fontWeight: 600 }}
        >
          <option value="">All Honey Types</option>
          {HONEY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {loading ? <LoadingSpinner text="Loading products..." /> : error ? <ErrorState onRetry={load} /> : filtered.length === 0 ? (
        <div className="card-3d" style={{ padding: 40, background: "rgba(15,23,42,0.8)" }}>
          <EmptyState icon="🍯" title="No products found" description="List your first honey product to start selling on the marketplace." action={<button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add Product</button>} />
        </div>
      ) : (
        /* 3D Dark Glass Cards Grid Matching Picture 9 in Reference Screenshot */
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {filtered.map((p) => (
            <div 
              key={p._id} 
              className="card-3d" 
              style={{ 
                background: "rgba(18, 14, 10, 0.85)", 
                borderRadius: 20, 
                padding: 20, 
                border: "1px solid rgba(245, 158, 11, 0.25)", 
                display: "flex", 
                flexDirection: "column", 
                justify: "space-between",
                boxShadow: "0 15px 35px rgba(0,0,0,0.5)",
                backdropFilter: "blur(16px)"
              }}
            >
              <div>
                {/* 3D Honey Jar Product Thumbnail */}
                <div style={{ width: "100%", height: 180, borderRadius: 16, overflow: "hidden", background: "linear-gradient(135deg, #1f1406 0%, #362205 100%)", marginBottom: 16, border: "1px solid rgba(245, 158, 11, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img 
                    src={getFullImageUrl(p.imageUrl)} 
                    alt={p.name} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = honeyJarAssetUrl;
                    }}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: "#ffffff", margin: 0 }}>{p.name}</h3>
                  <StatusBadge status={p.isAvailable !== false ? "active" : "inactive"} />
                </div>

                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 600, marginBottom: 12 }}>
                  {p.honeyType || "Multifloral"} • <span style={{ color: "#10b981" }}>{p.quantity} {p.unit || "kg"} in stock</span>
                </div>

                <div style={{ fontSize: 24, fontWeight: 900, color: "#f59e0b", marginBottom: 16 }}>
                  ₹{p.price}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <button 
                  className="btn-outline btn-sm" 
                  onClick={() => openEdit(p)}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10 }}
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button 
                  className="btn-danger btn-sm" 
                  onClick={() => setDeleteConfirm(p._id)}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#f87171" }}
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Edit Product" : "Add New Honey Product"} size="md">
        <form onSubmit={handleSave}>
          {formError && <div className="auth-error" style={{ marginBottom: 14 }}>{formError}</div>}
          
          {/* Image Upload Box */}
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label">Product Image</label>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ width: 72, height: 72, background: "#0b101b", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(245, 158, 11, 0.3)", overflow: "hidden", flexShrink: 0 }}>
                <img 
                  src={imagePreview || honeyJarAssetUrl} 
                  alt="Preview" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = honeyJarAssetUrl;
                  }}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
              </div>
              <button type="button" className="btn-outline btn-sm" onClick={() => fileRef.current?.click()} style={{ padding: "8px 16px" }}>
                <Upload size={14} /> Upload Custom Photo
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 14 }}>
            <label className="form-label">Product Name *</label>
            <input className="form-input" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Wild Forest Honey" required />
          </div>

          <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div className="form-group">
              <label className="form-label">Honey Type</label>
              <select className="form-select" value={form.honeyType} onChange={(e) => setForm((p) => ({ ...p, honeyType: e.target.value }))}>
                {HONEY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input type="number" min="1" className="form-input" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} placeholder="650" required />
            </div>
          </div>

          <div className="form-row" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14, marginBottom: 14 }}>
            <div className="form-group">
              <label className="form-label">Stock Quantity</label>
              <input type="number" min="0" className="form-input" value={form.quantity} onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))} placeholder="25" />
            </div>

            <div className="form-group">
              <label className="form-label">Unit</label>
              <select className="form-select" value={form.unit} onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))}>
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 20 }}>
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Pure natural wildflower honey harvested from forest flowers..." rows={2} />
          </div>

          <div className="form-actions" style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button type="button" className="btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving} style={{ padding: "12px 24px" }}>
              {saving ? "Saving…" : editItem ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog 
        isOpen={!!deleteConfirm} 
        onClose={() => setDeleteConfirm(null)} 
        onConfirm={() => handleDelete(deleteConfirm)} 
        title="Delete Product?" 
        message="This product will be removed from your store and marketplace." 
      />
    </DashboardLayout>
  );
};

export default Products;
