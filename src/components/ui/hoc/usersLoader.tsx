import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getDataStatus, loadUsersList } from "../../../store/users";

interface UsersLoaderProps {
  children: React.ReactNode;
}

const UsersLoader = ({ children }: UsersLoaderProps) => {
  const dataStatus = useAppSelector(getDataStatus());
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!dataStatus) {
      dispatch(loadUsersList());
    }
  }, [dataStatus, dispatch]);

  if (!dataStatus) {
    return <h2 className="text-center mt-5">Loading users...</h2>;
  }

  return <>{children}</>;
};

export default UsersLoader;
