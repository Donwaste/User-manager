import { useEffect, useState } from "react";
import TextField from "../common/form/textField";
import Validator from "../../utils/validator";
import CheckBoxField from "../common/form/checkBoxField";
// import * as yup from "yup";

const LoginForm = () => {
  const [data, setData] = useState({ email: "", password: "", stayOn: false });
  const [errors, setErrors] = useState({});

  const handleChange = (target) => {
    setData((prevState) => ({ ...prevState, [target.name]: target.value }));
  };

  useEffect(() => {
    validate();
  }, [data]);

  // const validateScheme = yup.object().shape({
  //   password: yup
  //     .string()
  //     .required("Password is required")
  //     .matches(
  //       /[A-Z]/,
  //       "Password must contain at least one uppercase character",
  //     )
  //     .matches(/[0-9]/, "Password must contain at least one number")
  //     .matches(
  //       /[!@#$^&*_-]/,
  //       "The password must contain one of the special characters (!@#$^&*_-)!",
  //     )
  //     .min(8, "Password must be at least 8 characters long"),
  //   email: yup.string().required("Email is required"),
  // });

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
    // validateScheme
    //   .validate(data)
    //   .then(() => setErrors({}))
    //   .catch((err) => setErrors({ [err.path]: err.message }));
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
      <CheckBoxField value={data.stayOn} onChange={handleChange} name="stayOn">
        Stay on?
      </CheckBoxField>
      <button
        type="submit"
        className="btn btn-primary w-100 mt-3"
        disabled={!isValid}
      >
        Submit
      </button>
    </form>
  );
};

export default LoginForm;
