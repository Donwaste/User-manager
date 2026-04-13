import { useState, useEffect } from "react";
import APi from "../../api";
import TextField from "../common/form/textField";
import Validator from "../../utils/validator";
import SelectField from "../common/form/selectField";
import RadioField from "../common/form/radioField";
import MultiSelectField from "../common/form/multiSelectField.jsx";
import CheckBoxField from "../common/form/checkBoxField.jsx";

const RegisterForm = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
    profession: "",
    sex: "Male",
    qualities: [],
    license: false,
  });
  const [qualities, setQualities] = useState({});
  const [errors, setErrors] = useState({});
  const [professions, setProfessions] = useState([]);

  const handleChange = (target) => {
    setData((prevState) => ({ ...prevState, [target.name]: target.value }));
  };

  useEffect(() => {
    APi.professions.fetchAll().then((data) => {
      const profArray = Array.isArray(data) ? data : Object.values(data);
      setProfessions(profArray);
    });
    APi.qualities.fetchAll().then((data) => setQualities(data));
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
    const errors = Validator({ data, config: validatorConfig });
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    validate();
  }, [data]);

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
      <SelectField
        defaultOption={"Choose..."}
        options={professions}
        onChange={handleChange}
        value={data.profession}
        error={errors.profession}
        name="professions"
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
