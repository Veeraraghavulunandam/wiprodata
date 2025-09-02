import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/client";
import toast from "react-hot-toast";

export default function Payment() {
  const { bookingId } = useParams();
  const nav = useNavigate();
  const [method, setMethod] = useState("Card"); // ✅ fixed typo
  const [busy, setBusy] = useState(false);

  const pay = async () => {
    try {
      setBusy(true);

      // ✅ Log request payload for debugging
      const payload = {
        bookingId: Number(bookingId),
        paymentMethod: method,
      };
      console.log("Sending payment payload:", payload);

      const { data } = await api.post("/Payment", payload);

      if (data.success) {
        toast.success(data.message || "Payment successful");
        nav("/me/bookings", { replace: true });
      } else {
        toast.error(data.message || "Payment failed");
      }
    } catch (e) {
      console.error("Payment error:", e.response?.data || e.message);
      toast.error(e?.response?.data?.message || "Payment failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 520, margin: "2rem auto" }}>
      <div className="card-body">
        <h2>Payment</h2>
        <p className="subtitle">Booking #{bookingId}</p>
        <div style={{ marginTop: "1rem" }}>
          <label className="subtitle">Payment method</label>
          <select
            className="select"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
            <option value="NetBanking">NetBanking</option>
          </select>
        </div>
        <button
          className="btn"
          style={{ marginTop: "1rem" }}
          onClick={pay}
          disabled={busy}
        >
          {busy ? "Processing…" : "Pay"}
        </button>
      </div>
    </div>
  );
}
