import React, { useEffect, useState } from "react";
import axios from "../api/client";
import StatusBadge from "../components/StatusBadge";

const BookingAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("/Admin/bookings");
      console.log("Bookings data:", res.data);
      
      // ✅ API returns { data: [...], message, success }
      setBookings(res.data.data || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/Admin/bookings/${id}/status`, { status });

      // ✅ update status locally
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading) return <p className="text-center">Loading bookings...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="border rounded-xl shadow p-4 bg-white"
            >
              <p><strong>User:</strong> {booking.users?.name || "N/A"}</p>
              <p><strong>Hotel:</strong> {booking.rooms?.hotels?.name || "N/A"}</p>
              <p>
                <strong>Room:</strong> {booking.rooms?.type || "N/A"}{" "}
                (#{booking.rooms?.roomNumber || "N/A"})
              </p>
              <p>
                <strong>Check-in:</strong>{" "}
                {booking.checkInDate
                  ? new Date(booking.checkInDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>Check-out:</strong>{" "}
                {booking.checkOutDate
                  ? new Date(booking.checkOutDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <p className="flex items-center gap-2">
                <strong>Status:</strong>
                <StatusBadge status={booking.status} />
              </p>

              {/* Actions */}
              <div className="mt-3 flex gap-2 items-center">
                <select
                  className="border rounded px-2 py-1"
                  value={booking.status}
                  onChange={(e) => updateStatus(booking.id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <button
                  className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                  onClick={() => updateStatus(booking.id, "Cancelled")}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingAdmin;
