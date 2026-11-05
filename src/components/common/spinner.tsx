interface SpinnerProps {
  size?: "sm" | "lg";
}

const Spinner = ({ size = "lg" }: SpinnerProps) =>
  size === "sm" ? (
    <span className="spinner-border spinner-border-sm" role="status">
      <span className="visually-hidden">Loading...</span>
    </span>
  ) : (
    <div className="d-flex justify-content-center mt-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

export default Spinner;
