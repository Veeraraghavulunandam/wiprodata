import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function NavBar() {
  const auth = useAuth();
  const { user, logout } = auth || {};

  return (
    <header className="header">
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: ".9rem 1rem",
        }}
      >
        {/* StayInn Brand with unique font */}
        <Link
          className="brand"
          to="/"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "32px",
            fontWeight: "700",
            letterSpacing: "1px",
            color: "#2c3e50",
            textDecoration: "none",
          }}
        >
          StayInn
        </Link>

        <nav className="nav">
          <NavLink to="/hotels">Hotels</NavLink>
          {user && <NavLink to="/me/bookings">My Bookings</NavLink>}
          {user?.role === "Admin" && <NavLink to="/admin">Admin</NavLink>}
          {!user ? (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          ) : (
            <button className="btn secondary" onClick={logout}>
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
