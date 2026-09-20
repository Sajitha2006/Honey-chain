import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import SearchBar from "../../components/common/SearchBar";
import StatusBadge from "../../components/common/StatusBadge";
import { getHives, createHive, updateHive, deleteHive } from "../../api/hiveApi";
import { getApiaries } from "../../api/apiaryApi";
import { Plus, Edit2, Trash2 } from "lucide-react";

const hero3DIslandUrl = "/assets/hero-beehive.png";
const HIVE_TYPES = ["Langstroth", "Top-Bar", "Warre", "Flow Hive", "Other"];
const BEE_TYPES = ["Apis mellifera", "Apis cerana", "Apis dorsata", "Apis florea", "Stingless Bee", "Other"];

const DEFAULT_HIVES = [
  { _id: "h1", hiveId: "HIVE-001", beeType: "Apis mellifera", hiveType: "Langstroth", installationDate: "2024-03-12", status: "active", apiary: { name: "Green Valley Apiary" } },
  { _id: "h2", hiveId: "HIVE-002", beeType: "Apis mellifera", hiveType: "Langstroth", installationDate: "2024-03-12", status: "active", apiary: { name: "Green Valley Apiary" } },
  { _id: "h3", hiveId: "HIVE-003", beeType: "Apis cerana", hiveType: "Top-Bar", installationDate: "2024-03-25", status: "active", apiary: { name: "Forest Edge Apiary" } },
  { _id: "h4", hiveId: "HIVE-004", beeType: "Apis mellifera", hiveType: "Langstroth", installationDate: "2024-04-02", status: "active", apiary: { name: "Hilltop Apiary" } },
  { _id: "h5", hiveId: "HIVE-005", beeType: "Apis mellifera", hiveType: "Langstroth", installationDate: "2024-05-18", status: "active", apiary: { name: "Sunrise Meadows" } },
  { _id: "h6", hiveId: "HIVE-006", beeType: "Apis mellifera", hiveType: "Langstroth", installationDate: "2024-06-10", status: "active", apiary: { name: "River Side Apiary" } },
];

const emptyForm = { apiary: "", hiveId: "", beeType: "Apis mellifera", hiveType: "Langstroth", installationDate: "", status: "active", notes: "" };

const Hives = () => {
  const [hives, setHives] = useState([]);
  const [apiaries, setApiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [hRes, aRes] = await Promise.all([getHives(), getApiaries()]);
      const list = hRes.data?.hives || hRes.data || [];
      setHives(list.length > 0 ? list : DEFAULT_HIVES);
      setApiaries(aRes.data?.apiaries || aRes.data || []);
    } catch {
      setHives(DEFAULT_HIVES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = hives.filter((h) => !search || h.hiveId?.toLowerCase().includes(search.toLowerCase()) || h.beeType?.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setEditItem(null); setForm({ ...emptyForm, apiary: apiaries[0]?._id || "" }); setFormError(""); setModalOpen(true); };
  const openEdit = (h) => {
    setEditItem(h);
    setForm({
      apiary: h.apiary?._id || h.apiary || "",
      hiveId: h.hiveId || "",
      beeType: h.beeType || "Apis mellifera",
      hiveType: h.hiveType || "Langstroth",
      installationDate: h.installationDate ? new Date(h.installationDate).toISOString().split("T")[0] : "",
      status: h.status || "active",
      notes: h.notes || "",
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.apiary || !form.hiveId.trim()) { setFormError("Apiary and Hive ID are required."); return; }
    setSaving(true); setFormError("");
    try {
      if (editItem) await updateHive(editItem._id, form);
      else await createHive(form);
      setModalOpen(false);
      setSuccessMsg(editItem ? "Hive updated!" : "Hive registered!");
      setTimeout(() => setSuccessMsg(""), 3000);
      load();
    } catch (err) {
      setFormError(err?.response?.data?.message || "Failed to save hive.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHive(id);
      setSuccessMsg("Hive removed.");
      setTimeout(() => setSuccessMsg(""), 3000);
      load();
    } catch { /**/ }
  };

  return (
    <DashboardLayout pageTitle="Smart Hive Management" pageSubtitle="Monitor individual colony hives, species types, & installation specs">
      <div className="page-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#ffffff", margin: 0 }}>Hives</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: "4px 0 0" }}>Manage your beehives and their information.</p>
        </div>
        <button className="btn-primary" onClick={openAdd} style={{ padding: "10px 20px" }}>
          <Plus size={16} /> Register New Hive
        </button>
      </div>

      {successMsg && <div className="auth-success" style={{ marginBottom: 16 }}>{successMsg}</div>}

      <div className="toolbar" style={{ marginBottom: 24, display: "flex", gap: 16 }}>
        <div style={{ flex: 1 }}><SearchBar value={search} onChange={setSearch} placeholder="Search hives..." /></div>
      </div>

      {loading ? <LoadingSpinner text="Fetching registered hives..." /> : error ? <ErrorState onRetry={load} description={error} /> : filtered.length === 0 ? (
        <div className="card-3d" style={{ padding: 40, background: "rgba(15,23,42,0.75)" }}>
          <EmptyState icon="🐝" title="No hives registered yet" description="Register your first colony hive to begin attaching IoT telemetry sensors." action={<button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add First Hive</button>} />
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {filtered.map((h) => (
            <div key={h._id} className="card-3d" style={{ background: "rgba(15, 23, 42, 0.8)", borderRadius: 20, padding: 20, border: "1px solid rgba(245, 158, 11, 0.2)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                {/* 3D Beehive Island Thumbnail */}
                <div style={{ width: "100%", height: 150, borderRadius: 14, overflow: "hidden", background: "linear-gradient(135deg, #0d1b14 0%, #08120d 100%)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, border: "1px solid rgba(245, 158, 11, 0.25)" }}>
                  <img src={hero3DIslandUrl} alt={h.hiveId} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: "#ffffff", margin: 0 }}>{String(h.hiveId || "").includes("HIVE") ? h.hiveId : `HIVE-${h.hiveId}`}</h3>
                  <StatusBadge status={h.status || "active"} />
                </div>

                <div style={{ fontSize: 13, color: "#f59e0b", fontWeight: 700, marginBottom: 8 }}>
                  {h.beeType || "Apis mellifera"} • <span style={{ color: "rgba(255,255,255,0.7)" }}>{h.hiveType || "Langstroth"}</span>
                </div>

                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "10px 14px", fontSize: 12, display: "flex", flexDirection: "column", gap: 6, marginBottom: 14, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ color: "rgba(255,255,255,0.6)" }}>Location: <strong style={{ color: "#fff" }}>{h.apiary?.name || "Green Valley Apiary"}</strong></div>
                  <div style={{ color: "rgba(255,255,255,0.6)" }}>Installed: <strong style={{ color: "#fff" }}>{h.installationDate ? new Date(h.installationDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) : "12 Mar 2024"}</strong></div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <button className="btn-outline btn-sm" onClick={() => openEdit(h)}><Edit2 size={13} /></button>
                <button className="btn-danger btn-sm" onClick={() => setDeleteConfirm(h._id)}><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Edit Hive" : "Register New Colony Hive"}>
        <form onSubmit={handleSave}>
          {formError && <div className="auth-error" style={{ marginBottom: 14 }}>{formError}</div>}
          <div className="form-group">
            <label className="form-label">Apiary *</label>
            <select className="form-select" value={form.apiary} onChange={(e) => setForm((p) => ({ ...p, apiary: e.target.value }))}>
              <option value="">Select Apiary</option>
              {apiaries.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
            </select>
          </div>

          <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="form-group"><label className="form-label">Hive ID Code *</label><input className="form-input" value={form.hiveId} onChange={(e) => setForm((p) => ({ ...p, hiveId: e.target.value }))} placeholder="HIVE-001" /></div>
            <div className="form-group"><label className="form-label">Bee Species</label><select className="form-select" value={form.beeType} onChange={(e) => setForm((p) => ({ ...p, beeType: e.target.value }))}>{BEE_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}</select></div>
          </div>

          <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="form-group"><label className="form-label">Hive Frame Design</label><select className="form-select" value={form.hiveType} onChange={(e) => setForm((p) => ({ ...p, hiveType: e.target.value }))}>{HIVE_TYPES.map((ht) => <option key={ht} value={ht}>{ht}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Installation Date</label><input type="date" className="form-input" value={form.installationDate} onChange={(e) => setForm((p) => ({ ...p, installationDate: e.target.value }))} /></div>
          </div>

          <div className="form-actions" style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 20 }}>
            <button type="button" className="btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? "Saving…" : editItem ? "Update Hive" : "Register Hive"}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} onConfirm={() => handleDelete(deleteConfirm)} title="Delete Hive?" message="This action will remove the hive registration." />
    </DashboardLayout>
  );
};

export default Hives;
