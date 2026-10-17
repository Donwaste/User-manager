import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { getCurrentUserId, getIsLoggedIn } from "../../store/users";

interface RouteGuardProps {
  children: React.ReactNode;
  onlyForGuests?: boolean;
  adminOnly?: boolean;
}

const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  onlyForGuests = false,
  adminOnly = false,
}) => {
  const isLoggedIn = useAppSelector(getIsLoggedIn());
  const location = useLocation();
  const currentUserId = useAppSelector(getCurrentUserId());
  const adminId = import.meta.env.VITE_ADMIN_ID;

  if (onlyForGuests && isLoggedIn) {
    const from =
      (location.state as { from?: { pathname: string } })?.from?.pathname ||
      "/users";
    return <Navigate to={from} replace />;
  }

  if (!onlyForGuests && !isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && currentUserId !== adminId) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default RouteGuard;
