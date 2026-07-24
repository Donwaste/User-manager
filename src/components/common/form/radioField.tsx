import { OptionType } from "../../../types";

interface RadioFieldProps {
  value: string;
  onChange: (target: { name: string; value: string }) => void;
  name: string;
  options: OptionType[];
  label: string;
}

const RadioField = ({
  value,
  onChange,
  name,
  options,
  label,
}: RadioFieldProps) => {
  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ name: target.name, value: target.value });
  };

  return (
    <div className="mb-4">
      <label className="form-label fw-bold">{label}</label>
      <div>
        {options.map((option) => (
          <div
            key={name + "_" + option.value}
            className="form-check form-check-inline"
          >
            <input
              className="form-check-input"
              type="radio"
              name={name}
              id={name + "_" + option.value}
              checked={option.value === value}
              value={option.value}
              onChange={handleChange}
            />
            <label
              className="form-check-label"
              htmlFor={name + "_" + option.value}
            >
              {option.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
export default RadioField;
