import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../api";
import Qualities from "../../../ui/qualities";

const UserPage = ({ userId }) => {
  const [user, setUser] = useState();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/users");
  };

  useEffect(() => {
    api.users.getById(userId).then((data) => setUser(data));
  }, [userId]);

  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <h1>Name: {user.name}</h1>
      <p>Profession: {user.profession.name}</p>
      <Qualities qualities={user.qualities} />
      <p>Completed Meetings: {user.completedMeetings}</p>
      <p>Rating: {user.rate}</p>
      <button onClick={handleClick} className="btn btn-primary">
        Back
      </button>
    </>
  );
};

export default UserPage;
