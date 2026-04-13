import { useParams } from "react-router-dom";
import LoginForm from "../components/ui/loginForm";
import { useState } from "react";
import RegisterForm from "../components/ui/registerForm";

const Login = () => {
  const register = "register";
  const login = "login";
  const { type } = useParams();
  const [formType, setFormType] = useState(type === register ? type : login);
  const toggleFormType = (params) => {
    setFormType((prevState) => (prevState === register ? login : register));
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="card shadow-sm p-4 rounded-4 ">
            {formType === login ? (
              <>
                <h3 className="mb-4">Login</h3>
                <LoginForm />
                <p>
                  Don't have account?
                  <a role="button" onClick={toggleFormType}>
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
                  <a role="button" onClick={toggleFormType}>
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
