import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../api/client";
import Spinner from "../components/Spinner";
import { useAuth } from "../auth/AuthContext";
import toast from "react-hot-toast";

export default function HotelDetails() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [dates, setDates] = useState({ in: "", out: "" });
  const [busy, setBusy] = useState(false);
  const { user } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  // ✅ Predefined room images
  const roomImages = {
    standard:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    deluxe:
      "https://thaka.bing.com/th/id/OIP.pT-e0SfSOJYc1E8_81H2pQHaE-?w=208&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    "royal suite":
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
  };

  useEffect(() => {
    if (loc.state?.dates) setDates(loc.state.dates);
    if (loc.state?.bookNow && user) {
      book(loc.state.bookNow, true);
    }
  }, [loc.state, user]);

  useEffect(() => {
    (async () => {
      try {
        const hotelsRes = await api.get("/Hotels");
        const hotelsArray = Array.isArray(hotelsRes.data)
          ? hotelsRes.data
          : hotelsRes.data?.data || [];

        const foundHotel = hotelsArray.find((h) => h.id === parseInt(id));
        if (!foundHotel) {
          setHotel(null);
          setRooms([]);
          return;
        }

        const hImg =
          foundHotel.imageUrl ||
          `https://source.unsplash.com/1600x900/?luxury-hotel,resort,travel&sig=${id}`;

        setHotel({ ...foundHotel, imageUrl: hImg });
      } catch (err) {
        console.error("Error fetching hotel:", err);
        setHotel(null);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!hotel) return;
    (async () => {
      try {
        let url = `/Rooms/by-hotel/${id}`;
        if (dates.in && dates.out) {
          url += `?checkIn=${dates.in}&checkOut=${dates.out}`;
        }

        const roomsRes = await api.get(url);
        const roomsArray = Array.isArray(roomsRes.data)
          ? roomsRes.data
          : roomsRes.data?.data || [];

        const filteredRooms = roomsArray.map((rm, i) => {
          const typeKey = (rm.type || "").toLowerCase().trim();
          return {
            ...rm,
            imageUrl:
              rm.imageUrl ||
              roomImages[typeKey] ||
              `https://source.unsplash.com/600x400/?hotel-room&sig=${i}`,
          };
        });

        setRooms(filteredRooms);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setRooms([]);
      }
    })();
  }, [id, hotel, dates]);

  const book = async (roomId, auto = false) => {
    if (!user) {
      nav("/login", { state: { from: `/hotels/${id}`, dates, bookNow: roomId } });
      return;
    }

    if (!dates.in || !dates.out) {
      if (!auto) toast.error("Select check-in and check-out dates");
      return;
    }

    try {
      setBusy(true);
      const { data } = await api.post("/Booking", {
        roomId,
        checkInDate: new Date(dates.in).toISOString(),
        checkOutDate: new Date(dates.out).toISOString(),
      });

      const bookingId =
        data.id || data.bookingId || data.data?.id || data.data?.bookingId;

      if (!bookingId) {
        toast.error("Booking created but no ID returned");
        return;
      }

      toast.success("Room reserved. Proceed to payment.");
      nav(`/pay/${bookingId}`);
    } catch (e) {
      console.error("Booking error:", e.response?.data || e.message);
      toast.error(e?.response?.data?.message || "Booking failed");
    } finally {
      setBusy(false);
    }
  };

  if (!hotel) return <Spinner />;

  return (
    <div
      style={{
        backgroundImage: `url(${hotel.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      {/* Glass Box Wrapper */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          borderRadius: "12px",
          padding: "1.5rem",
          maxWidth: "1100px",
          margin: "0 auto",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        {/* Hotel Info */}
        <div className="card" style={{ border: "2px solid #ccc" }}>
          <img
            src={hotel.imageUrl}
            alt={hotel.name}
            style={{
              borderRadius: "12px",
              maxHeight: "420px",
              objectFit: "cover",
              width: "100%",
            }}
          />
          <div className="card-body">
            <h2
              style={{
                margin: "0 0 .3rem",
                fontSize: "1.8rem",
                color: "#1f2937",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {hotel.name}
            </h2>
            <div className="subtitle" style={{ color: "#4b5563" }}>
              {hotel.address} — {hotel.city}, {hotel.country}
            </div>
          </div>
        </div>

        {/* Date Selectors */}
        <div
          className="card"
          style={{
            marginTop: "1rem",
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#f9fafb",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              alignItems: "end",
            }}
          >
            <div>
              <label className="subtitle">Check-in</label>
              <input
                className="input"
                type="date"
                value={dates.in}
                onChange={(e) => setDates((s) => ({ ...s, in: e.target.value }))}
              />
            </div>
            <div>
              <label className="subtitle">Check-out</label>
              <input
                className="input"
                type="date"
                value={dates.out}
                onChange={(e) => setDates((s) => ({ ...s, out: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Rooms */}
        <h3 className="section-title" style={{ marginTop: "2rem", color: "#111827" }}>
          Available Rooms
        </h3>
        <div className="grid cols-3" style={{ gap: "1rem" }}>
          {rooms.length ? (
            rooms.map((r) => (
              <div
                key={r.id}
                className="card"
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  overflow: "hidden",
                  background: "#fff",
                }}
              >
                <img
                  src={r.imageUrl}
                  alt={r.type}
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <strong>
                      {r.type} — #{r.roomNumber}
                    </strong>
                    {r.isAvailable ? (
                      <span className="badge">Available</span>
                    ) : (
                      <span
                        className="badge"
                        style={{ background: "#fee2e2", color: "#991b1b" }}
                      >
                        Unavailable
                      </span>
                    )}
                  </div>
                  <div style={{ margin: ".5rem 0 1rem", fontSize: "1.1rem" }}>
                    ₹ {Number(r.price).toLocaleString()}
                  </div>
                  <button
                    className="btn"
                    disabled={!r.isAvailable || busy}
                    onClick={() => book(r.id)}
                  >
                    {r.isAvailable ? "Book" : "Not available"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No rooms found for this hotel.</p>
          )}
        </div>
      </div>
    </div>
  );
}
