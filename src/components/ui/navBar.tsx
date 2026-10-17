import { Link } from "react-router-dom";
import NavProfile from "./qualities/navProfile";
import { useAppSelector } from "../../store/hooks";
import { getCurrentUserId, getIsLoggedIn } from "../../store/users";

const NavBar = () => {
  const isLoggedIn = useAppSelector(getIsLoggedIn());
  const currentUserId = useAppSelector(getCurrentUserId());
  const adminId = import.meta.env.VITE_ADMIN_ID;

  return (
    <nav className="navbar bg-light mb-3">
      <div className="container-fluid">
        <ul className="nav">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Home
            </Link>
          </li>
          {isLoggedIn && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/users">
                  Users
                </Link>
              </li>
              {currentUserId === adminId && (
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">
                    Admin Panel
                  </Link>
                </li>
              )}
            </>
          )}
        </ul>
        <div className="d-flex align-items-center">
          {isLoggedIn ? (
            <NavProfile />
          ) : (
            <Link className="nav-link" to="/login">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
