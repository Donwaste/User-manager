import { useNavigate } from "react-router-dom";
import { UserType } from "../../types";

interface UserCardProps {
  user: UserType;
}

const UserCard = ({ user }: UserCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(location.pathname + "/edit");
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <button
          className="position-absolute top-0 end-0 btn btn-light btn-sm"
          onClick={handleClick}
        >
          <i className="bi bi-gear"></i>
        </button>
        <div className="d-flex flex-column align-items-center text-center position-relative">
          <img
            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user._id}`}
            className="rounded-circle"
            width="150"
          />
          <div className="mt-3">
            <h4>{user.name}</h4>
            <p className="text-secondary mb-1">{user.profession.name}</p>
            <div className="text-muted">
              <i
                className="bi bi-caret-down-fill text-primary"
                role="button"
              ></i>
              <i className="bi bi-caret-up text-secondary" role="button"></i>
              <span className="ms-2">{user.rate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
