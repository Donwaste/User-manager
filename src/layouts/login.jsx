import { useParams, useNavigate } from "react-router-dom";
import LoginForm from "../components/ui/loginForm";
import RegisterForm from "../components/ui/registerForm";

const Login = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  const formType = type === "register" ? "register" : "login";

  const toggleFormType = () => {
    navigate(formType === "register" ? "/login" : "/login/register");
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="card shadow-sm p-4 rounded-4 ">
            {formType === "login" ? (
              <>
                <h3 className="mb-4">Login</h3>
                <LoginForm />
                <p>
                  Don't have account?
                  <a
                    role="button"
                    onClick={toggleFormType}
                    className="text-primary text-decoration-underline"
                  >
                    Sign Up
                  </a>
                </p>
              </>
            ) : (
              <>
                <h3 className="mb-4">Register</h3>
                <RegisterForm />
                <p>
                  Already have account?
                  <a
                    role="button"
                    onClick={toggleFormType}
                    className="text-primary text-decoration-underline"
                  >
                    Sign In
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
