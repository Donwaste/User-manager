import React from "react";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (target: { name: string; value: string }) => void;
  defaultOption: string;
  options?: SelectOption[];
  error?: string | null;
  disabled?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  defaultOption,
  options = [],
  error,
  disabled = false,
}) => {
  const handleChange = ({ target }: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ name: target.name, value: target.value });
  };

  return (
    <div className="mb-4">
      <label htmlFor={name} className="form-label fw-bold">
        {label}
      </label>

      <select
        className={`form-select ${error ? "is-invalid" : ""}`}
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        disabled={disabled}
      >
        <option disabled value="">
          {defaultOption}
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default SelectField;
