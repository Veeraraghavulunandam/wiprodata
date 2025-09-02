import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RoleGuard({ allow=[] }){
  const { user } = useAuth();
  if(!user) return <Navigate to="/login" replace />;
  if(!allow.includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet/>;
}
