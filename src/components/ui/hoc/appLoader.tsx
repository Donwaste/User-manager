import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  getIsLoggedIn,
  getUsersLoadingStatus,
  getCurrentUserData,
  getUsersList,
  loadUsersList,
  logOut,
  getAuthErrors,
} from "../../../store/users";
import { loadQualitiesList } from "../../../store/qualities";
import { loadProfessionsList } from "../../../store/professions";
import Spinner from "../../common/spinner";
import { toast } from "react-toastify";

interface AppLoaderProps {
  children: React.ReactNode;
}

const AppLoader = ({ children }: AppLoaderProps) => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(getIsLoggedIn());
  const usersStatusLoading = useAppSelector(getUsersLoadingStatus());
  const currentUser = useAppSelector(getCurrentUserData());
  const users = useAppSelector(getUsersList());
  const usersError = useAppSelector(getAuthErrors());

  useEffect(() => {
    dispatch(loadQualitiesList());
    dispatch(loadProfessionsList());
  }, [dispatch]);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(loadUsersList());
    }
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    if (
      isLoggedIn &&
      !usersStatusLoading &&
      users &&
      users.length > 0 &&
      !currentUser
    ) {
      toast("Account not found. You will be logged out.");
      dispatch(logOut());
    }
  }, [isLoggedIn, usersStatusLoading, users, currentUser, dispatch]);

  if (isLoggedIn && usersStatusLoading) return <Spinner />;
  if (isLoggedIn && !currentUser) {
    if (usersError) {
      return (
        <div className="text-center mt-5">
          <p>Failed to load data. Please check your connection.</p>
          <button
            className="btn btn-primary me-2"
            onClick={() => dispatch(loadUsersList())}
          >
            Retry
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => dispatch(logOut())}
          >
            Log Out
          </button>
        </div>
      );
    }
    return <Spinner />;
  }

  return <>{children}</>;
};

export default AppLoader;
