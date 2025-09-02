import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: "240px 1fr", gap: "1rem", marginTop: "1rem" }}
    >
      <aside className="card" style={{ height: "fit-content" }}>
        <div className="card-body">
          <h3 style={{ marginTop: 0 }}>Admin</h3>
          <nav className="grid" style={{ gap: ".5rem" }}>
            <NavLink to="/admin">Dashboard</NavLink>
            <NavLink to="/admin/hotels">Hotels</NavLink>
            <NavLink to="/admin/rooms">Rooms</NavLink>
            <NavLink to="/admin/bookings">Bookings</NavLink> {/* ✅ new link */}
          </nav>
        </div>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
