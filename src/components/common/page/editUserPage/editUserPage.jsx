import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Validator from "../../../../utils/validator";
import api from "../../../../api";
import TextField from "../../form/textField";
import SelectField from "../../form/selectField";
import RadioField from "../../form/radioField";
import MultiSelectField from "../../form/multiSelectField";

const EditUserPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  const [data, setData] = useState({
    name: "",
    email: "",
    profession: "",
    sex: "male",
    qualities: [],
  });

  const [professions, setProfessions] = useState([]);
  const [qualities, setQualities] = useState([]);
  const [errors, setErrors] = useState({});

  const transformData = (data) => {
    return data.map((qual) => ({ label: qual.name, value: qual._id }));
  };

  useEffect(() => {
    setIsLoading(true);

    api.users.getById(userId).then(({ profession, qualities, ...userData }) =>
      setData((prevState) => ({
        ...prevState,
        ...userData,
        qualities: transformData(qualities),
        profession: profession._id,
      })),
    );
    api.professions.fetchAll().then((data) => {
      const professionsList = data.map((profession) => ({
        name: profession.name,
        value: profession._id,
      }));
      setProfessions(professionsList);
    });

    api.qualities.fetchAll().then((data) => {
      const qualitiesList = Object.keys(data).map((optionName) => ({
        value: data[optionName]._id,
        label: data[optionName].name,
        color: data[optionName].color,
      }));
      setQualities(qualitiesList);
    });
  }, [userId]);

  useEffect(() => {
    if (data._id) setIsLoading(false);
  }, [data]);

  const validatorConfig = {
    email: {
      isRequired: { message: "Email is required" },
      isEmail: { message: "Email address was entered incorrectly" },
    },
    name: {
      isRequired: { message: "Enter name" },
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

  const handleChange = (target) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value,
    }));
  };

  const getProfessionById = (id) => {
    for (const prof of professions) {
      if (prof.value === id) {
        return { _id: prof.value, name: prof.name };
      }
    }
  };
  const getQualities = (elements) => {
    const qualitiesArray = [];
    for (const elem of elements) {
      for (const quality of qualities) {
        if (elem.value === quality.value) {
          qualitiesArray.push({
            _id: quality.value,
            name: quality.label,
            color: quality.color,
          });
        }
      }
    }
    return qualitiesArray;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) return;

    const { profession, qualities: selectedQualities } = data;

    api.users
      .update(userId, {
        ...data,
        profession: getProfessionById(profession),
        qualities: getQualities(selectedQualities),
      })

      .then((updatedData) => navigate(`/users/${updatedData._id}`));
  };

  const isValid = Object.keys(errors).length === 0;

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3 shadow p-4">
          {!isLoading && professions.length > 0 ? (
            <form onSubmit={handleSubmit}>
              <TextField
                label="Name"
                name="name"
                value={data.name}
                onChange={handleChange}
                error={errors.name}
              />
              <TextField
                label="Email"
                name="email"
                value={data.email}
                onChange={handleChange}
                error={errors.email}
              />
              <SelectField
                label="Choose your profession"
                defaultOption="Choose..."
                options={professions}
                name="profession"
                onChange={handleChange}
                value={data.profession}
                error={errors.profession}
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
                defaultValue={data.qualities}
                options={qualities}
                onChange={handleChange}
                name="qualities"
                label="Choose your qualities"
              />
              <button
                type="submit"
                disabled={!isValid}
                className="btn btn-primary w-100 mx-auto mt-3"
              >
                Update
              </button>
            </form>
          ) : (
            <h2>Loading...</h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditUserPage;
