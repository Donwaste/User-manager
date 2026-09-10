import { useState } from "react";
import TextAreaField from "../form/textAreaField";
import { validator } from "../../../utils/validator";

interface AddCommentFormProps {
  onSubmit: (data: { content: string }) => void;
}

const AddCommentForm = ({ onSubmit }: AddCommentFormProps) => {
  const [data, setData] = useState<{ content?: string }>({});
  const [errors, setErrors] = useState<{ content?: string }>({});

  const handleChange = (target: { name: string; value: string }) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value,
    }));
  };

  const validatorConfig = {
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

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) return;

    onSubmit(data as { content: string });
    setData({});
    setErrors({});
  };

  return (
    <div>
      <h2>New comment</h2>
      <form onSubmit={handleSubmit}>
        <TextAreaField
          value={data.content || ""}
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
