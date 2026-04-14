import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../api";
import Qualities from "../../../ui/qualities";

const UserPage = ({ userId }) => {
  const [user, setUser] = useState();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/users");
  };

  const handleEdit = () => {
    navigate(`/users/${userId}/edit`);
  };

  useEffect(() => {
    api.users.getById(userId).then((data) => setUser(data));
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>Name: {user.name}</h1>
      <p>Profession: {user.profession.name}</p>
      <Qualities qualities={user.qualities} />
      <p>Completed Meetings: {user.completedMeetings}</p>
      <p>Rating: {user.rate}</p>

      <div className="d-flex flex-column gap-3 align-items-start">
        <button onClick={handleEdit} className="btn btn-warning">
          Edit
        </button>
        <button onClick={handleBack} className="btn btn-primary">
          Back to all
        </button>
      </div>
    </div>
  );
};

export default UserPage;
