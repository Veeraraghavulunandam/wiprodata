import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Hotels from "./pages/Hotels";
import HotelDetails from "./pages/HotelDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/MyBookings";
import Payment from "./pages/Payment";
import ProtectedRoute from "./auth/ProtectedRoute";
import RoleGuard from "./auth/RoleGuard";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import HotelsAdmin from "./admin/HotelsAdmin";
import RoomsAdmin from "./admin/RoomsAdmin";
import BookingAdmin from "./admin/BookingAdmin";

export default function App(){
  return (
    <>
      <NavBar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/hotels" element={<Hotels/>}/>
          <Route path="/hotels/:id" element={<HotelDetails/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route element={<ProtectedRoute/>}>
            <Route path="/me/bookings" element={<MyBookings/>}/>
            <Route path="/pay/:bookingId" element={<Payment/>}/>
          </Route>
          <Route element={<RoleGuard allow={["Admin"]}/>}>
            <Route path="/admin" element={<AdminLayout/>}>
              <Route index element={<Dashboard/>}/>
              <Route path="hotels" element={<HotelsAdmin/>}/>
              <Route path="rooms" element={<RoomsAdmin/>}/>
              <Route path="bookings" element={<BookingAdmin />} /> {/* ✅ new */}
            </Route>
          </Route>
        </Routes>
      </div>
    </>
  );
}
