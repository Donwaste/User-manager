import { useState } from "react";
import { useAppDispatch } from "../store/hooks";
import adminService from "../services/admin.service";
import { loadUsersList } from "../store/users";

const AdminPage = () => {
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    try {
      await adminService.resetDatabase();
      dispatch(loadUsersList());
      setShowModal(false);
    } catch (error) {
      console.error("Error resetting database:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-5">
          <div className="card border-danger shadow-sm">
            <div className="card-header bg-danger text-white fw-bold"></div>
            <div className="card-body text-center p-4">
              <h5 className="card-title mb-3">Reset database state</h5>
              <p className="card-text text-muted mb-4">
                All created users and changes will be permanently deleted.
              </p>
              <button
                type="button"
                className="btn btn-danger px-4"
                onClick={() => setShowModal(true)}
              >
                Delete data
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <>
          <div className="modal fade show d-block" tabIndex={1} role="dialog">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Delete confirmation</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p className="mb-0">
                    Are you sure? This action will return the database to its
                    original state.
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleReset}
                    disabled={loading}
                  >
                    {loading ? "Deleting..." : "Yes, delete everything"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default AdminPage;
