import { useState, useEffect } from "react";
import APi from "../../api/index.js";
import TextField from "../common/form/textField.js";
import { validator } from "../../utils/validator.js";
import SelectField from "../common/form/selectField.js";
import RadioField from "../common/form/radioField.js";
import MultiSelectField from "../common/form/multiSelectField.js";
import CheckBoxField from "../common/form/checkBoxField.js";
import { QualityType, OptionType, QualityOption } from "../../types";

interface RegisterFormData {
  email: string;
  password: string;
  profession: string;
  sex: string;
  license: boolean;
  qualities: QualityOption[];
}

const RegisterForm = () => {
  const [data, setData] = useState<RegisterFormData>({
    email: "",
    password: "",
    profession: "",
    sex: "Male",
    qualities: [],
    license: false,
  });

  const [qualities, setQualities] = useState<QualityOption[]>([]);
  const [errors, setErrors] = useState({} as Record<string, string>);
  const [professions, setProfessions] = useState<OptionType[]>([]);

  const handleChange = (target: {
    name: string;
    value: string | boolean | string[];
  }) => {
    setData((prevState) => ({ ...prevState, [target.name]: target.value }));
  };

  useEffect(() => {
    APi.professions.fetchAll().then((data) => {
      const profArray = data.map((profession) => ({
        name: profession.name,
        value: profession._id,
      }));
      setProfessions(profArray);
    });

    APi.qualities.fetchAll().then((data) => {
      const qualitiesList = data.map((quality: QualityType) => ({
        value: quality._id,
        label: quality.name,
        color: quality.color,
      }));
      setQualities(qualitiesList);
    });
  }, []);

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

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
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
        options={professions}
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
        options={qualities}
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
