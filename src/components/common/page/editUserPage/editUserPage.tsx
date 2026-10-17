import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validator } from "../../../../utils/validator";
import TextField from "../../form/textField";
import SelectField from "../../form/selectField";
import RadioField from "../../form/radioField";
import MultiSelectField from "../../form/multiSelectField";
import BackButton from "../../backButton";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { getCurrentUserData, updateUser } from "../../../../store/users";
import { getQualities, getQualitiesStatus } from "../../../../store/qualities";
import { UserType } from "../../../../types";
import {
  getProfessions,
  getProfessionsLoadingStatus,
} from "../../../../store/professions";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../../utils/getErrorMessage";

interface QualityOption {
  label: string;
  value: string;
  color?: string;
}

interface EditUserFormData {
  _id?: string;
  name: string;
  email: string;
  profession: string;
  sex: string;
  qualities: (QualityOption | string)[];
}

const EditUserPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(getCurrentUserData());

  const professionsLoading = useAppSelector(getProfessionsLoadingStatus());
  const professions = useAppSelector(getProfessions());
  const qualities = useAppSelector(getQualities());
  const qualitiesLoading = useAppSelector(getQualitiesStatus());

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<EditUserFormData>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const professionsList = (professions || []).map((p) => ({
    label: p.name,
    name: p.name,
    value: p._id,
  }));

  const qualitiesList = (qualities || []).map((q) => ({
    label: q.name,
    value: q._id,
    color: q.color,
  }));

  function getQualitiesListByIds(qualitiesIds: string[]) {
    const qualitiesArray = [];
    for (const qualId of qualitiesIds) {
      for (const quality of qualities || []) {
        if (quality._id === qualId) {
          qualitiesArray.push(quality);
          break;
        }
      }
    }
    return qualitiesArray;
  }

  const transformData = (data: string[]) => {
    return getQualitiesListByIds(data).map((qual) => ({
      label: qual.name,
      value: qual._id,
    }));
  };

  useEffect(() => {
    if (
      !professionsLoading &&
      !qualitiesLoading &&
      currentUser &&
      !data &&
      qualities
    ) {
      setData({
        ...currentUser,
        sex: currentUser.sex || "male",
        qualities: transformData(currentUser.qualities || []),
      });
    }
  }, [professionsLoading, qualitiesLoading, currentUser, data, qualities]);

  useEffect(() => {
    if (data && isLoading) {
      setIsLoading(false);
    }
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
    if (!data) return false;
    const errors = validator(data, validatorConfig);
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    validate();
  }, [data]);

  const handleChange = (target: { name: string; value: unknown }) => {
    setData((prevState) => ({
      ...prevState!,
      [target.name]: target.value,
    }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid || !data) return;

    const qualitiesIds = data.qualities.map((q) =>
      typeof q === "object" && q !== null ? q.value : q,
    );

    try {
      await dispatch(
        updateUser({
          ...currentUser,
          ...data,
          qualities: qualitiesIds,
        } as UserType),
      );
      navigate(`/users/${currentUser?._id}`);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  const isValid = Object.keys(errors).length === 0;

  return (
    <div className="container mt-5">
      <BackButton />
      <div className="row">
        <div className="col-md-6 offset-md-3 shadow p-4">
          {!isLoading && professionsList.length > 0 && data ? (
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
                options={professionsList}
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
                options={qualitiesList}
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
