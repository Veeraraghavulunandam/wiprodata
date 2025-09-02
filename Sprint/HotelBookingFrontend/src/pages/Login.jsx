import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const { login, loading } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form.email, form.password);

      if (res.ok) {
        const user = res.user;
        const redirectTo =
          loc.state?.from || (user?.role === "Admin" ? "/admin" : "/hotels");

        toast.success(
          user?.role === "Admin" ? "Welcome Admin!" : "Welcome Guest!"
        );

        nav(redirectTo, { replace: true, state: loc.state });
      } else {
        toast.error(res.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed");
    }
  };

  return (
    <div
      className="hero"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Poppins', sans-serif", // ✅ modern font
      }}
    >
      <div className="inner">
        <div
          className="container"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <form
            onSubmit={submit}
            className="form-box"
            style={{
              width: "420px",
              background: "rgba(255,255,255,0.95)",
              borderRadius: "16px",
              padding: "2rem",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "0.5rem",
                color: "#1e3a8a",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              Login
            </h2>
            <p
              className="subtitle"
              style={{
                marginTop: "-.2rem",
                marginBottom: "1rem",
                textAlign: "center",
                color: "#555",
                fontSize: "0.95rem",
              }}
            >
              Access booking & payments
            </p>

            <div style={{ marginTop: "1rem" }}>
              <input
                className="input"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "1rem",
                }}
              />
            </div>
            <div style={{ marginTop: "1rem" }}>
              <input
                className="input"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "1rem",
                }}
              />
            </div>
            <button
              className="btn"
              style={{
                marginTop: "1.5rem",
                width: "100%",
                padding: "0.9rem",
                borderRadius: "10px",
                backgroundColor: "#2563eb",
                color: "white",
                fontWeight: "600",
                fontSize: "1rem",
                border: "none",
                cursor: "pointer",
                transition: "0.3s",
              }}
              disabled={loading}
            >
              {loading ? "Signing in…" : "Login"}
            </button>

            <p style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.9rem" }}>
              New here?{" "}
              <Link
                to="/register"
                style={{ color: "#2563eb", fontWeight: "500" }}
              >
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

