import { useEffect, useState } from "react";
import api from "../api/client";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";

export default function Hotels() {
  const [hotels, setHotels] = useState(null);
  const [q, setQ] = useState("");

  // ✅ Unique images mapped by cleaned hotel name
  const hotelImages = {
    "taj palace":
      "https://wallpaperaccess.com/full/13588721.jpg",
    "itc maurya":
      "https://edge.media.datahc.com/HI571508852.jpg",
    "leela palace":
      "https://thaka.bing.com/th/id/OIP.zvFpsdvfDuCJ-vT4KvRJIwHaEK?w=292&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    "og grand":
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    "royal blu":
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
    "krishna grands":
      "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1200&q=80",
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/Hotels");
        const hotelsArray = res.data.data;

        const withImg = hotelsArray.map((h, i) => {
          const key = (h.name || "").toLowerCase().trim(); // 👈 normalize name
          return {
            ...h,
            imageUrl:
              h.imageUrl ||
              hotelImages[key] || // check in dictionary
              `https://source.unsplash.com/900x600/?hotel,${h.city || "luxury"}&sig=${i}`,
          };
        });
        setHotels(withImg);
      } catch (err) {
        console.error("Failed to fetch hotels", err);
      }
    })();
  }, []);

  if (!hotels) return <Spinner />;

  const filtered = q
    ? hotels.filter((h) =>
        (h.name + " " + (h.city || "") + " " + (h.country || ""))
          .toLowerCase()
          .includes(q.toLowerCase())
      )
    : hotels;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "Poppins, sans-serif",
        backgroundImage:
          'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255,255,255,0.85)",
          borderRadius: "16px",
          padding: "2rem",
        }}
      >
        {/* 🔍 Search */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
          <input
            placeholder="🔍 Search by name, city, or country..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{
              width: "60%",
              padding: "0.8rem 1rem",
              fontSize: "1rem",
              border: "2px solid #ddd",
              borderRadius: "12px",
              outline: "none",
            }}
          />
        </div>

        {/* 🏨 Hotels Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {filtered.map((h) => (
            <div
              key={h.id}
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                backgroundColor: "white",
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {/* Hotel Image */}
              <img
                src={h.imageUrl}
                alt={h.name}
                style={{ width: "100%", height: "220px", objectFit: "cover" }}
              />
              <div style={{ padding: "1rem" }}>
                <h3 style={{ fontSize: "1.4rem", fontWeight: 700 }}>{h.name}</h3>
                <p style={{ fontSize: "1rem", opacity: 0.8 }}>
                  📍 {h.city}, {h.country}
                </p>
                <p style={{ fontSize: "0.9rem", color: "#475569" }}>{h.address}</p>
                <Link
                  to={`/hotels/${h.id}`}
                  style={{
                    background: "#2563eb",
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "10px",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                  }}
                >
                  View Rooms →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

