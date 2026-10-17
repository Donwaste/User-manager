import { displayDate } from "../../../utils/displayDate";
import { CommentType } from "../../../types";
import { useAppSelector } from "../../../store/hooks";
import { getCurrentUserId, getUserById } from "../../../store/users";

interface CommentProps {
  comment?: CommentType;
  content?: string;
  created_at?: string | number;
  _id?: string;
  userId?: string;
  onRemove: (id: string) => void;
}

const Comment = (props: CommentProps) => {
  const currentComment = props.comment || props;
  const { content, created_at: created, _id: id, userId } = currentComment;
  const { onRemove } = props;

  const currentUserId = useAppSelector(getCurrentUserId());
  const user = useAppSelector(getUserById(userId || ""));

  return (
    <div className="bg-light card-body mb-3 rounded">
      <div className="row">
        <div className="col">
          <div className="d-flex flex-start">
            <img
              src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${userId}`}
              className="rounded-circle shadow-1-strong me-3"
              alt="avatar"
              width="65"
              height="65"
            />
            <div className="flex-grow-1 flex-shrink-1">
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <p className="mb-1">
                    {user ? user.name : "Loading..."}{" "}
                    <span className="small text-muted ms-2">
                      - {created ? displayDate(String(created)) : ""}
                    </span>
                  </p>
                  {currentUserId === userId && (
                    <button
                      className="btn btn-sm text-primary d-flex align-items-center"
                      onClick={() => id && onRemove(id)}
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  )}
                </div>
                <p className="small mb-0">{content}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
