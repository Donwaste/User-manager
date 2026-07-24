import { OptionType } from "../../../types";

interface SelectFieldProps {
  label?: string;
  onChange: (target: { name: string; value: string }) => void;
  value: string;
  defaultOption: string;
  name: string;
  error?: string;
  options: OptionType[];
}

const SelectField = ({
  label,
  value,
  onChange,
  defaultOption,
  options,
  error,
  name,
}: SelectFieldProps) => {
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
      >
        <option disabled value="">
          {defaultOption}
        </option>

        {options &&
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
      </select>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default SelectField;
