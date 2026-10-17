import { Routes, Route, Navigate } from "react-router-dom";
import Users from "./layouts/users";
import Login from "./layouts/login";
import Main from "./layouts/main";
import NavBar from "./components/ui/navBar";
import { ToastContainer } from "react-toastify";
import RouteGuard from "./components/common/routeGuard";
import LogOut from "./layouts/logOut";
import AppLoader from "./components/ui/hoc/appLoader";
import AdminPage from "./layouts/adminPanel";

function App() {
  return (
    <AppLoader>
      <NavBar />
      <Routes>
        <Route
          path="/users/:userId?/:edit?"
          element={
            <RouteGuard>
              <Users />
            </RouteGuard>
          }
        />
        <Route
          path="/login/:type?"
          element={
            <RouteGuard onlyForGuests>
              <Login />
            </RouteGuard>
          }
        />
        <Route path="/logout" element={<LogOut />} />
        <Route path="/" element={<Main />} />
        <Route
          path="/admin"
          element={
            <RouteGuard adminOnly>
              <AdminPage />
            </RouteGuard>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </AppLoader>
  );
}

export default App;
