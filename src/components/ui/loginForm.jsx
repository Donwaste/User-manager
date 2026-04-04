import { useEffect, useState } from "react";
import TextField from "../common/form/textField";
import Validator from "../../utils/validator";

const LoginForm = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = ({ target }) => {
    setData((prevState) => ({ ...prevState, [target.name]: target.value }));
    console.log(target.value);
  };

  useEffect(() => {
    validate();
  }, [data]);

  const validatorConfig = {
    email: {
      isRequired: {
        message: "Email is required",
      },
      isEmail: {
        message: "Email address was entered incorrectly ",
      },
    },
    password: {
      isRequired: {
        message: "Password is required",
      },
      isCapital: {
        message: "Password must contain at least one uppercase character ",
      },
      isContainDigit: {
        message: "Password must contain at least one number ",
      },
      min: {
        message: "Password must be at least 8 characters long",
        value: 8,
      },
    },
  };

  const validate = () => {
    const errors = Validator({ data, config: validatorConfig });
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const isValid = Object.keys(errors).length === 0;
  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) return;
    console.log(data);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="card shadow-sm p-4 rounded-4 ">
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                name="email"
                value={data.email}
                onChange={handleChange}
                error={errors.email}
              />
              <TextField
                type="password"
                label="Password"
                name="password"
                value={data.password}
                onChange={handleChange}
                error={errors.password}
              />
              <button
                type="submit"
                className="btn btn-primary w-100 mt-3"
                disabled={!isValid}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
