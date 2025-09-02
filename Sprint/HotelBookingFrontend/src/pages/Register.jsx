import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const { register, loading } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  // ✅ carry booking context forward (hotel, dates, roomId)
  const from = loc.state?.from || "/";
  const dates = loc.state?.dates || null;
  const bookNow = loc.state?.bookNow || null;

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(form.name, form.email, form.password);

      if (res.ok) {
        toast.success("Account created! Please login.");
        // ✅ redirect to login and preserve booking info
        nav("/login", { state: { from, dates, bookNow } });
      } else {
        toast.error(res.message || "Registration failed");
      }
    } catch (err) {
      console.error("Register error:", err);
      toast.error("Registration failed");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* dark overlay for readability */}
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.55)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        <form
          onSubmit={submit}
          style={{
            width: "460px",
            background: "rgba(255,255,255,0.95)",
            borderRadius: "12px",
            padding: "2rem",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          }}
        >
          <h2 style={{ marginTop: 0, color: "#2563eb", fontWeight: "700" }}>
            Create Account
          </h2>
          <p
            className="subtitle"
            style={{ marginTop: "-.4rem", color: "#444", fontSize: "0.95rem" }}
          >
            Book and pay securely
          </p>

          <div style={{ marginTop: "1rem" }}>
            <input
              className="input"
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "1rem",
              }}
            />
          </div>
          <div style={{ marginTop: "1rem" }}>
            <input
              className="input"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "1rem",
              }}
            />
          </div>
          <div style={{ marginTop: "1rem" }}>
            <input
              className="input"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "1rem",
              }}
            />
          </div>

          <button
            className="btn"
            style={{
              marginTop: "1.2rem",
              width: "100%",
              padding: "0.8rem",
              border: "none",
              borderRadius: "8px",
              background: "#2563eb",
              color: "#fff",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
            }}
            disabled={loading}
          >
            {loading ? "Creating…" : "Register"}
          </button>

          {/* 👇 login link */}
          <p
            style={{
              marginTop: "1rem",
              textAlign: "center",
              fontSize: "0.95rem",
              color: "#222", // changed font color here
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              state={{ from, dates, bookNow }}
              style={{
                color: "#fff",
                fontWeight: "600",
                backgroundColor: "#2563eb",
                padding: "2px 6px",
                borderRadius: "4px",
                textDecoration: "none",
              }}
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
