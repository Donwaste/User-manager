import { Routes, Route, Navigate } from "react-router-dom";
import Users from "./layouts/users";
import Login from "./layouts/login";
import Main from "./layouts/main";
import NavBar from "./components/ui/navBar";
import { ToastContainer } from "react-toastify";
import { ProfessionProvider } from "./hooks/useProfession";
import QualityProvider from "./hooks/useQualities";
import AuthProvider from "./hooks/useAuth";
import ProtectedRoute from "./components/common/protectedRoute";
import LogOut from "./layouts/logOut";

const App = () => (
  <>
    <AuthProvider>
      <NavBar />
      <ProfessionProvider>
        <QualityProvider>
          <Routes>
            <Route
              path="/users/:userId?/:edit?"
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route path="/login/:type?" element={<Login />} />
            <Route path="/logout" element={<LogOut />} />
            <Route path="/" element={<Main />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </QualityProvider>
      </ProfessionProvider>
    </AuthProvider>
    <ToastContainer />
  </>
);

export default App;
