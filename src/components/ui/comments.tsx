import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { orderBy } from "lodash";
import CommentsList, { AddCommentForm } from "../common/comments";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  createComment,
  getComments,
  getCommentsLoadingStatus,
  loadCommentsList,
  removeComment,
} from "../../store/comments";

const Comments = () => {
  const { userId } = useParams<{ userId: string }>();
  const dispatch = useAppDispatch();

  const comments = useAppSelector(getComments());
  const isLoading = useAppSelector(getCommentsLoadingStatus());

  useEffect(() => {
    if (userId) {
      dispatch(loadCommentsList(userId));
    }
  }, [userId, dispatch]);

  const handleSubmit = (data: { content: string }) => {
    if (userId) {
      dispatch(createComment({ ...data, pageId: userId }));
    }
  };

  const handleRemoveComment = (id: string) => {
    dispatch(removeComment(id));
  };

  const sortedComments = orderBy(comments || [], ["created_at"], ["desc"]);

  return (
    <>
      <div className="card mb-2">
        <div className="card-body">
          <AddCommentForm onSubmit={handleSubmit} />
        </div>
      </div>
      {sortedComments.length > 0 && (
        <div className="card mb-3">
          <div className="card-body">
            <h2>Comments</h2>
            <hr />
            {!isLoading ? (
              <CommentsList
                comments={sortedComments}
                onRemove={handleRemoveComment}
              />
            ) : (
              <p>Loading comments...</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Comments;
