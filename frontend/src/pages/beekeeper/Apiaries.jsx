import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import SearchBar from "../../components/common/SearchBar";
import {
  getApiaries,
  createApiary,
  updateApiary,
  deleteApiary,
} from "../../api/apiaryApi";
import { Plus, Edit2, Trash2, MapPin } from "lucide-react";

const apiaryAssetUrl = "/assets/apiary-island.png";

const DEFAULT_APIARIES = [
  {
    _id: "1",
    name: "Green Valley Apiary",
    location: "Coimbatore, TN",
    description: "12 Monitored Hives in active flower bloom field.",
    isAvailable: true,
    hivesCount: 12,
  },
  {
    _id: "2",
    name: "Forest Edge Apiary",
    location: "Nilgiris, TN",
    description: "18 Monitored Hives near wild pine forest.",
    isAvailable: true,
    hivesCount: 18,
  },
  {
    _id: "3",
    name: "Hilltop Apiary",
    location: "Yercaud, TN",
    description: "8 Monitored Hives on organic coffee plantation.",
    isAvailable: true,
    hivesCount: 8,
  },
  {
    _id: "4",
    name: "Sunrise Meadows",
    location: "Pollachi, TN",
    description: "15 Monitored Hives in acacia blossom meadow.",
    isAvailable: true,
    hivesCount: 15,
  },
  {
    _id: "5",
    name: "River Side Apiary",
    location: "Erode, TN",
    description: "6 Monitored Hives near river delta field.",
    isAvailable: true,
    hivesCount: 6,
  },
  {
    _id: "6",
    name: "Blossom Field Apiary",
    location: "Salem, TN",
    description: "14 Monitored Hives in multiflora orchard.",
    isAvailable: true,
    hivesCount: 14,
  },
];

const emptyForm = {
  name: "",
  location: "",
  description: "",
  isAvailable: true,
};

const Apiaries = () => {
  const [apiaries, setApiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const load = () =>
    getApiaries()
      .then((res) => {
        const list = res.data?.apiaries || res.data || [];
        setApiaries(list.length > 0 ? list : DEFAULT_APIARIES);
      })
      .catch(() => setApiaries(DEFAULT_APIARIES))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const getLocationText = (location) => {
    if (typeof location === "string") return location;
    if (!location) return "Location unavailable";
    return (
      [location.address, location.district, location.state, location.pincode]
        .filter(Boolean)
        .join(", ") || "Location unavailable"
    );
  };

  const filtered = apiaries.filter(
    (a) =>
      !search ||
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      getLocationText(a.location).toLowerCase().includes(search.toLowerCase()),
  );

  const openAdd = () => {
    setEditItem(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  };
  const openEdit = (a) => {
    setEditItem(a);
    setForm({
      name: a.name || "",
      location: getLocationText(a.location),
      description: a.description || "",
      isAvailable: a.isAvailable !== false,
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.location.trim()) {
      setFormError("Name and location are required.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      if (editItem) await updateApiary(editItem._id, form);
      else await createApiary(form);
      setModalOpen(false);
      setSuccessMsg(editItem ? "Apiary updated!" : "Apiary created!");
      setTimeout(() => setSuccessMsg(""), 3000);
      load();
    } catch (err) {
      setFormError(err?.response?.data?.message || "Failed to save apiary.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteApiary(id);
      setSuccessMsg("Apiary deleted.");
      setTimeout(() => setSuccessMsg(""), 3000);
      load();
    } catch {
      /**/
    }
  };

  return (
    <DashboardLayout
      pageTitle="Apiaries"
      pageSubtitle="Manage all your apiaries in one place."
    >
      <div
        className="page-header-row"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>
            🏡 Apiaries
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            Manage your apiary locations and installed hive groups
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={openAdd}
          style={{ padding: "10px 20px" }}
        >
          <Plus size={16} /> + Add Apiary
        </button>
      </div>

      {successMsg && (
        <div className="auth-success" style={{ marginBottom: 16 }}>
          {successMsg}
        </div>
      )}

      <div className="toolbar" style={{ marginBottom: 24 }}>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search apiaries…"
        />
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching apiary locations..." />
      ) : filtered.length === 0 ? (
        <div
          className="card-3d"
          style={{ padding: 40, background: "rgba(15,23,42,0.75)" }}
        >
          <EmptyState
            icon="🏡"
            title="No apiaries found"
            description="Create your first apiary location."
            action={
              <button className="btn-primary" onClick={openAdd}>
                <Plus size={16} /> Add Apiary
              </button>
            }
          />
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {filtered.map((a) => (
            <div
              key={a._id}
              className="card-3d"
              style={{
                background: "rgba(15, 23, 42, 0.8)",
                borderRadius: 20,
                padding: 20,
                border: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                {/* 3D Floating Island Graphic Header */}
                <div
                  style={{
                    width: "100%",
                    height: 160,
                    borderRadius: 14,
                    overflow: "hidden",
                    background:
                      "linear-gradient(135deg, #0d1b14 0%, #08120d 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                  }}
                >
                  <img
                    src={apiaryAssetUrl}
                    alt={a.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 900,
                      color: "#fff",
                      margin: 0,
                    }}
                  >
                    {a.name}
                  </h3>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: "#10b981",
                      background: "rgba(16,185,129,0.15)",
                      padding: "3px 10px",
                      borderRadius: 99,
                    }}
                  >
                    ● Active
                  </span>
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "var(--honey-gold)",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 8,
                  }}
                >
                  <MapPin size={14} /> {getLocationText(a.location)}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.6)",
                    marginBottom: 14,
                  }}
                >
                  {a.hivesCount || 12} Hives Installed
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                  paddingTop: 14,
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <button
                  className="btn-outline btn-sm"
                  onClick={() => openEdit(a)}
                >
                  <Edit2 size={13} />
                </button>
                <button
                  className="btn-danger btn-sm"
                  onClick={() => setDeleteConfirm(a._id)}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? "Edit Apiary" : "Add New Apiary Location"}
      >
        <form onSubmit={handleSave}>
          {formError && (
            <div className="auth-error" style={{ marginBottom: 14 }}>
              {formError}
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Apiary Name *</label>
            <input
              className="form-input"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Green Valley Apiary"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Location Address *</label>
            <input
              className="form-input"
              value={form.location}
              onChange={(e) =>
                setForm((p) => ({ ...p, location: e.target.value }))
              }
              placeholder="Coimbatore, Tamil Nadu"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Organic wildflower field surrounded by acacia trees..."
              rows={3}
            />
          </div>
          <div
            className="form-actions"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              marginTop: 20,
            }}
          >
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving
                ? "Saving…"
                : editItem
                  ? "Update Apiary"
                  : "Create Apiary"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm)}
        title="Delete Apiary?"
        message="This action will remove the apiary record."
      />
    </DashboardLayout>
  );
};

export default Apiaries;
