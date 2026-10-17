import React from "react";

interface FormFieldTarget {
  name: string;
  value: string;
}

interface TextAreaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (target: FormFieldTarget) => void;
  error?: string | null;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  rows = 3,
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ name: e.target.name, value: e.target.value });
  };

  const getInputClasses = () => {
    return `form-control${error ? " is-invalid" : ""}`;
  };

  return (
    <div className="mb-4">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <div className="input-group has-validation">
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          className={getInputClasses()}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
        />
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    </div>
  );
};

export default TextAreaField;
