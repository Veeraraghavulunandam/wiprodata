import { useEffect, useState } from "react";
import api from "../api/client";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";

export default function MyBookings() {
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ fetch my bookings on mount
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/Booking/me");
        if (data.success) {
          setBookings(data.data);
        } else {
          toast.error(data.message || "Could not load bookings");
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        toast.error(err?.response?.data?.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ✅ cancel booking handler
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const { data } = await api.delete(`/Booking/${id}`);
      if (data.success) {
        toast.success("Booking cancelled successfully");
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: "Cancelled" } : b))
        );
      } else {
        toast.error(data.message || "Failed to cancel booking");
      }
    } catch (err) {
      console.error("Cancel booking error:", err);
      toast.error(err?.response?.data?.message || "Failed to cancel booking");
    }
  };

  if (loading) return <Spinner />;

  if (!bookings || bookings.length === 0) {
    return (
      <div className="card" style={{ margin: "2rem auto", maxWidth: 600 }}>
        <div className="card-body">
          <h2>No Bookings Found</h2>
          <p>You haven’t made any bookings yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="section-title">My Bookings</h2>
      <div className="grid cols-2">
        {bookings.map((b) => (
          <div key={b.id} className="card">
            <div className="card-body">
              <h3>
                {b.rooms?.type} – Room #{b.rooms?.roomNumber}
              </h3>
              <p>
                <strong>Hotel:</strong> {b.rooms?.hotels?.name}
              </p>
              <p>
                <strong>Check-in:</strong>{" "}
                {new Date(b.checkInDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Check-out:</strong>{" "}
                {new Date(b.checkOutDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Total:</strong> ₹ {Number(b.totalPrice).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className="badge"
                  style={{
                    background:
                      b.status === "Confirmed"
                        ? "#d1fae5"
                        : b.status === "Cancelled"
                        ? "#fee2e2"
                        : "#fef9c3",
                    color:
                      b.status === "Confirmed"
                        ? "#065f46"
                        : b.status === "Cancelled"
                        ? "#991b1b"
                        : "#92400e",
                  }}
                >
                  {b.status}
                </span>
              </p>

              {/* ✅ Cancel button (only show if not already cancelled) */}
              {b.status !== "Cancelled" && (
                <button
                  className="btn btn-danger"
                  onClick={() => handleCancel(b.id)}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
