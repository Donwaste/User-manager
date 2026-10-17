import React, { useEffect, useState } from "react";
import TextField from "../common/form/textField";
import { validator } from "../../utils/validator";
import CheckBoxField from "../common/form/checkBoxField";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { login, getAuthErrors } from "../../store/users";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { Credentials } from "../../types";

const LoginForm = () => {
  const [data, setData] = useState<Credentials>({
    email: "",
    password: "",
    stayOn: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (target: { name: string; value: string | boolean }) => {
    setData((prevState) => ({ ...prevState, [target.name]: target.value }));
  };

  const validatorConfig = {
    email: {
      isRequired: { message: "Email is required" },
      isEmail: { message: "Email address was entered incorrectly" },
    },
    password: {
      isRequired: { message: "Password is required" },
      isCapital: {
        message: "Password must contain at least one uppercase character",
      },
      isContainDigit: { message: "Password must contain at least one number" },
      min: {
        message: "Password must be at least 8 characters long",
        value: 8,
      },
    },
  };

  const validate = () => {
    const errors = validator(data, validatorConfig);
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    validate();
  }, [data]);

  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) return;

    try {
      await dispatch(login(data));
      const redirectPath = location.state?.from?.pathname || "/";
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setErrors({ email: getErrorMessage(error) });
    }
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
        autoComplete="current-password"
        type="password"
        label="Password"
        name="password"
        value={data.password}
        onChange={handleChange}
        error={errors.password}
      />
      <CheckBoxField
        value={!!data.stayOn}
        onChange={handleChange}
        name="stayOn"
      >
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
