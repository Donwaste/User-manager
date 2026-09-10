import Select from "react-select";
import { MultiValue } from "react-select";

interface SelectOptionType {
  label: string;
  value: string;
}
interface MultiSelectFieldProps {
  options: SelectOptionType[];
  onChange: (target: { name: string; value: any }) => void;
  name: string;
  label: string;
  defaultValue?: (SelectOptionType | string)[];
}

const MultiSelectField = ({
  options,
  onChange,
  name,
  label,
  defaultValue,
}: MultiSelectFieldProps) => {
  const handleChange = (newValue: MultiValue<SelectOptionType>) => {
    const selectedValues = newValue
      ? newValue.map((option) => option.value)
      : [];
    onChange({ name, value: selectedValues });
  };

  const normalizedDefaultValue = defaultValue?.map((v) =>
    typeof v === "string"
      ? (options.find((o) => o.value === v) ?? { label: v, value: v })
      : v,
  );

  return (
    <div className="mb-4">
      <label className="form-label fw-bold">{label}</label>
      <Select
        isMulti
        defaultValue={normalizedDefaultValue}
        options={options}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={handleChange}
        name={name}
      />
    </div>
  );
};

export default MultiSelectField;
