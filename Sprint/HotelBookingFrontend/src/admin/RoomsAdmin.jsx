import { useEffect, useState } from "react";
import api from "../api/client";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";

export default function RoomsAdmin() {
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [hotelId, setHotelId] = useState("");
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [form, setForm] = useState({
    roomNumber: "",
    type: "Standard",
    price: "",
    isAvailable: true,
  });
  const [editing, setEditing] = useState(null);

  // ---------------------------
  // Load hotels
  // ---------------------------
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/hotels");
        console.log("Hotels response:", data);
        setHotels(data.data || []); // ✅ unwrap "data"
      } catch {
        toast.error("Failed to load hotels");
      }
    })();
  }, []);

  // ---------------------------
  // Load rooms by hotel
  // ---------------------------
  const loadRooms = async (hid) => {
    if (!hid) return setRooms([]);
    setLoadingRooms(true);
    try {
      const { data } = await api.get(`/rooms/by-hotel/${hid}`);
      console.log("Rooms response:", data);
      setRooms(Array.isArray(data) ? data : data.data || []);
    } catch {
      toast.error("Failed to load rooms");
      setRooms([]);
    } finally {
      setLoadingRooms(false);
    }
  };

  // ---------------------------
  // On hotel change
  // ---------------------------
  const onHotelChange = (hid) => {
    setHotelId(hid);
    setEditing(null);
    setForm({ roomNumber: "", type: "Standard", price: "", isAvailable: true });
    loadRooms(hid);
  };

  // ---------------------------
// Save room (Add / Edit)
// ---------------------------
const save = async (e) => {
  e.preventDefault();
  if (!hotelId) return toast.error("Select a hotel");

  // payload for backend
  const payload = {
    hotelId,
    roomNumber: form.roomNumber,
    type: form.type,
    price: Number(form.price),
    isAvailable: form.isAvailable
  };

  try {
    if (editing) {
      // include id when editing
      await api.put(`/rooms/${editing.id}`, { ...payload, id: editing.id });
      toast.success("Room updated");
    } else {
      await api.post(`/rooms`, payload);
      toast.success("Room added");
    }

    // reset form
    setEditing(null);
    setForm({ roomNumber: "", type: "Standard", price: "", isAvailable: true });

    // reload rooms list
    await loadRooms(hotelId);

  } catch (err) {
    console.error(err.response?.data || err.message);
    toast.error("Save failed");
  }
};
  // ---------------------------
  // Delete room
  // ---------------------------
  const del = async (id) => {
    if (!window.confirm("Delete this room?")) return;
    try {
      await api.delete(`/rooms/${id}`);
      await loadRooms(hotelId);
      toast("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  // ---------------------------
  // Render
  // ---------------------------
  if (!hotels.length) return <Spinner />;

  return (
    <div className="grid" style={{ gap: "1rem" }}>
      {/* ------------------- Room Form ------------------- */}
      <div className="card">
        <div className="card-body">
          <h2>Rooms</h2>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <label className="subtitle">Hotel</label>
            <select
              className="select"
              value={hotelId}
              onChange={(e) => onHotelChange(e.target.value)}
            >
              <option value="">Select hotel</option>
              {hotels.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>

          <form
            onSubmit={save}
            className="grid"
            style={{ gap: ".6rem", gridTemplateColumns: "repeat(5, 1fr)" }}
          >
            <input
              className="input"
              placeholder="Room #"
              value={form.roomNumber}
              onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
              required
            />
            <select
              className="select"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option>Standard</option>
              <option>Deluxe</option>
              <option>Suite</option>
              <option>Royal Suite</option>
            </select>
            <input
              className="input"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
            <select
              className="select"
              value={String(form.isAvailable)}
              onChange={(e) =>
                setForm({ ...form, isAvailable: e.target.value === "true" })
              }
            >
              <option value="true">Available</option>
              <option value="false">Not available</option>
            </select>
            <button className="btn" type="submit">
              {editing ? "Update" : "Add room"}
            </button>
          </form>
        </div>
      </div>

      {/* ------------------- Room Table ------------------- */}
      <div className="card">
        <div className="card-body">
          {loadingRooms ? (
            <Spinner />
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Room</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Avail</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>#{r.roomNumber}</td>
                    <td>{r.type}</td>
                    <td>₹ {Number(r.price).toLocaleString()}</td>
                    <td>{r.isAvailable ? "Yes" : "No"}</td>
                    <td style={{ display: "flex", gap: ".5rem" }}>
                      <button
                        className="btn secondary"
                        onClick={() => {
                          setEditing(r);
                          setForm({
                            roomNumber: r.roomNumber,
                            type: r.type,
                            price: r.price,
                            isAvailable: !!r.isAvailable,
                          });
                        }}
                      >
                        Edit
                      </button>
                      <button className="btn" onClick={() => del(r.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {!rooms.length && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No rooms found for this hotel
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
