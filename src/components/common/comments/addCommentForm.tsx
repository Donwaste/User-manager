import { useEffect, useState } from "react";
import API from "../../../api";
import SelectField from "../form/selectField";
import TextAreaField from "../form/textAreaField";
import { validator } from "../../../utils/validator";
import { UserType } from "../../../types";

interface AddCommentFormProps {
  onSubmit: (data: { userId: string; content: string }) => void;
}

interface errorsType {
  userId?: string;
  content?: string;
}
const initialData = { userId: "", content: "" };

const AddCommentForm = ({ onSubmit }: AddCommentFormProps) => {
  const [data, setData] = useState(initialData);
  const [users, setUsers] = useState<UserType[]>([]);
  const [errors, setErrors] = useState<errorsType>({});
  const handleChange = (target: { name: string; value: string }) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value,
    }));
  };
  const validatorConfig = {
    userId: {
      isRequired: {
        message: "Select on whose behalf you want to send the message",
      },
    },
    content: {
      isRequired: {
        message: "The message cannot be empty",
      },
    },
  };

  const validate = () => {
    const errors = validator(data, validatorConfig);
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };
  useEffect(() => {
    API.users.fetchAll().then(setUsers);
  }, []);
  const clearForm = () => {
    setData(initialData);
    setErrors({});
  };
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) return;
    onSubmit(data);
    clearForm();
  };
  const arrayOfUsers = users.map((user) => ({
    name: user.name,
    value: user._id,
  }));
  return (
    <div>
      <h2>New comment</h2>
      <form onSubmit={handleSubmit}>
        <SelectField
          onChange={handleChange}
          options={arrayOfUsers}
          name="userId"
          value={data.userId}
          defaultOption="Choose the author of the message"
          error={errors.userId}
        />
        <TextAreaField
          value={data.content}
          onChange={handleChange}
          name="content"
          label="Message"
          error={errors.content}
        />
        <div className="d-flex justify-content-end">
          <button className="btn btn-primary">Publish</button>
        </div>
      </form>
    </div>
  );
};

export default AddCommentForm;
