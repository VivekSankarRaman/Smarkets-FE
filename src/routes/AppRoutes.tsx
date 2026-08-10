import { Route, Routes } from "react-router";
import { Layout } from "../components/Layout/Layout";
import { EventPage } from "../pages/EventPage";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { paths } from "./paths";
// import { ProtectedRoute } from "./ProtectedRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route path={paths.login} element={<LoginPage />} />
      {/* <Route element={<ProtectedRoute />}> */}
      <Route element={<Layout />}>
        <Route path={paths.home} element={<HomePage />} />
        <Route path={paths.event} element={<EventPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      {/* </Route> */}
    </Routes>
  );
}
