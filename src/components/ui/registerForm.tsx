import { useState, useEffect } from "react";
import TextField from "../common/form/textField.tsx";
import { validator } from "../../utils/validator.ts";
import SelectField from "../common/form/selectField.tsx";
import RadioField from "../common/form/radioField.tsx";
import MultiSelectField from "../common/form/multiSelectField.tsx";
import CheckBoxField from "../common/form/checkBoxField.tsx";
import { QualityOption } from "../../types";
import { useQualities } from "../../hooks/useQualities.tsx";
import { useProfessions } from "../../hooks/useProfession.tsx";
import { useAuth } from "../../hooks/useAuth.tsx";
import { useNavigate } from "react-router-dom";

interface RegisterFormData {
  email: string;
  password: string;
  name: string;
  profession: string;
  sex: string;
  license: boolean;
  qualities: QualityOption[];
}

const RegisterForm = () => {
  const [data, setData] = useState<RegisterFormData>({
    email: "",
    password: "",
    name: "",
    profession: "",
    sex: "Male",
    qualities: [],
    license: false,
  });
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { qualities } = useQualities();
  const qualitiesList =
    qualities.map((q) => ({
      label: q.name,
      value: q._id,
      color: q.color,
    })) || [];
  const { professions } = useProfessions();
  const professionsList =
    professions.map((p) => ({
      label: p.name,
      value: p._id,
    })) || [];
  const [errors, setErrors] = useState({} as Record<string, string>);

  const handleChange = (target: {
    name: string;
    value: string | boolean | string[];
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
    const newData = {
      ...data,
    };
    try {
      await signUp(newData);
      navigate("/");
    } catch (error) {
      setErrors(error as Record<string, string>);
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
        defaultOption={"Choose..."}
        options={professionsList}
        onChange={handleChange}
        value={data.profession}
        error={errors.profession}
        name="profession"
        label="Select your profession"
      />
      <RadioField
        options={[
          { name: "Male", value: "Male" },
          { name: "Female", value: "Female" },
          { name: "Other", value: "Other" },
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
        Confirm the<a> license agreement</a>?
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
