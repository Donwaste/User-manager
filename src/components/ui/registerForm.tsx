import React, { useState, useEffect } from "react";
import TextField from "../common/form/textField";
import { validator } from "../../utils/validator";
import SelectField from "../common/form/selectField";
import RadioField from "../common/form/radioField";
import MultiSelectField from "../common/form/multiSelectField";
import CheckBoxField from "../common/form/checkBoxField";
import { QualityOption, SignUpData } from "../../types";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { getQualities } from "../../store/qualities";
import { getProfessions } from "../../store/professions";
import { signUp, getAuthErrors } from "../../store/users";
import { getErrorMessage } from "../../utils/getErrorMessage";

const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState<SignUpData>({
    email: "",
    password: "",
    name: "",
    profession: "",
    sex: "male",
    qualities: [],
    license: false,
  });

  const qualities = useAppSelector(getQualities());
  const qualitiesList =
    (qualities || []).map((q) => ({
      label: q.name,
      value: q._id,
      color: q.color,
    })) || [];

  const professions = useAppSelector(getProfessions());
  const professionsList = (professions || []).map((p) => ({
    label: p.name,
    value: p._id,
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (target: {
    name: string;
    value: string | boolean | string[] | QualityOption[];
  }) => {
    setData((prevState) => ({ ...prevState, [target.name]: target.value }));
  };

  const validatorConfig = {
    email: {
      isRequired: {
        message: "Email is required",
      },
      isEmail: {
        message: "Email address was entered incorrectly",
      },
    },
    password: {
      isRequired: {
        message: "Password is required",
      },
      isCapital: {
        message: "Password must contain at least one uppercase character",
      },
      isContainDigit: {
        message: "Password must contain at least one number",
      },
      min: {
        message: "Password must be at least 8 characters long",
        value: 8,
      },
    },
    name: {
      isRequired: {
        message: "Name is required",
      },
      min: {
        message: "Name must be at least 3 characters long",
        value: 3,
      },
    },
    profession: {
      isRequired: {
        message: "Profession is required",
      },
    },
    license: {
      isRequired: {
        message: "Please confirm that you have read the license agreement.",
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
      await dispatch(signUp(data));
      navigate("/", { replace: true });
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
        label="Name"
        name="name"
        value={data.name}
        onChange={handleChange}
        error={errors.name}
      />
      <TextField
        autoComplete="new-password"
        type="password"
        label="Password"
        name="password"
        value={data.password}
        onChange={handleChange}
        error={errors.password}
      />
      <SelectField
        defaultOption="Choose..."
        options={professionsList}
        onChange={handleChange}
        value={data.profession}
        error={errors.profession}
        name="profession"
        label="Select your profession"
      />
      <RadioField
        options={[
          { name: "Male", value: "male" },
          { name: "Female", value: "female" },
          { name: "Other", value: "other" },
        ]}
        value={data.sex}
        name="sex"
        onChange={handleChange}
        label="Select your gender"
      />
      <MultiSelectField
        options={qualitiesList}
        onChange={handleChange}
        defaultValue={data.qualities}
        name="qualities"
        label="Choose your qualities"
      />
      <CheckBoxField
        value={data.license}
        onChange={handleChange}
        name="license"
        error={errors.license}
      >
        Confirm the <a>license agreement</a>?
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

export default RegisterForm;
