import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";
import { getCurrentUserData } from "../../../store/users";

const NavProfile = () => {
  const currentUser = useAppSelector(getCurrentUserData());
  const [isOpen, setOpen] = useState(false);

  if (!currentUser) return null;

  const toggleMenu = () => {
    setOpen((prevState) => !prevState);
  };

  return (
    <div className="dropdown" onClick={toggleMenu}>
      <div className="btn dropdown-toggle d-flex align-items-center">
        <div className="me-2">{currentUser.name}</div>
        <img
          src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${currentUser._id}`}
          alt="avatar"
          className="img-responsive rounded-circle"
          height="40"
        />
      </div>
      <div className={"w-100 dropdown-menu" + (isOpen ? " show" : "")}>
        <Link to={`/users/${currentUser._id}`} className="dropdown-item">
          Profile
        </Link>
        <Link to="/logout" className="dropdown-item">
          Log Out
        </Link>
      </div>
    </div>
  );
};

export default NavProfile;
