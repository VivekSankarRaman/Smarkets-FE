import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "../app/hooks";
import { paths } from "./paths";

export function ProtectedRoute() {
  const token = useAppSelector((state) => state.auth.token);

  if (!token) {
    return <Navigate to={paths.login} replace />;
  }

  return <Outlet />;
}
