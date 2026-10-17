import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { logOut } from "../store/users";

const LogOut = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(logOut());
  }, [dispatch]);

  return <Navigate to="/" replace />;
};

export default LogOut;
