import { useEffect, useState } from "react";
import api from "../api/client";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";

export default function HotelsAdmin() {
  const [items, setItems] = useState(null);
  const [form, setForm] = useState({ name: "", address: "", city: "", country: "", imageUrl: "" });
  const [edit, setEdit] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get("/hotels"); // ✅ correct endpoint
      setItems(data.data || data); // depends on your ApiResponse structure
    } catch (err) {
      console.error("Load hotels failed", err);
      toast.error("Failed to load hotels");
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (edit) {
        await api.put(`/hotels/${edit.id}`, form);
        toast.success("Hotel updated");
      } else {
        await api.post("/hotels", form);
        toast.success("Hotel created");
      }
      setForm({ name: "", address: "", city: "", country: "", imageUrl: "" });
      setEdit(null);
      await load();
    } catch {
      toast.error("Save failed");
    } finally {
      setBusy(false);
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this hotel?")) return;
    try {
      await api.delete(`/hotels/${id}`);
      toast.success("Deleted");
      await load();
    } catch {
      toast.error("Delete failed");
    }
  };

  if (!items) return <Spinner />;

  return (
    <div className="grid" style={{ gap: "1rem" }}>
      <div className="card">
        <div className="card-body">
          <h2>Hotels</h2>
          <form onSubmit={submit} className="grid" style={{ gap: ".6rem", gridTemplateColumns: "repeat(6, 1fr)" }}>
            <input className="input" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <input className="input" placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            <input className="input" placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
            <input className="input" placeholder="Country" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
            <input className="input" placeholder="Image URL (optional)" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
            <button className="btn" disabled={busy} type="submit">{edit ? "Update" : "Add"}</button>
          </form>
          {edit && (
            <div style={{ marginTop: ".5rem" }}>
              <button className="btn ghost" onClick={() => {
                setEdit(null);
                setForm({ name: "", address: "", city: "", country: "", imageUrl: "" });
              }}>
                Cancel edit
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <table className="table">
            <thead><tr><th>#</th><th>Name</th><th>City</th><th>Country</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map(h => (
                <tr key={h.id}>
                  <td>{h.id}</td>
                  <td>{h.name}</td>
                  <td>{h.city}</td>
                  <td>{h.country}</td>
                  <td style={{ display: "flex", gap: ".5rem" }}>
                    <button className="btn secondary" onClick={() => {
                      setEdit(h);
                      setForm({
                        name: h.name,
                        address: h.address,
                        city: h.city,
                        country: h.country,
                        imageUrl: h.imageUrl || ""
                      });
                    }}>Edit</button>
                    <button className="btn" onClick={() => del(h.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
