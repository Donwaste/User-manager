import Select from "react-select";
import { MultiValue } from "react-select";
import { OptionType, QualityOption } from "../../../types";

interface MultiSelectFieldProps {
  options: QualityOption[];
  onChange: (target: { name: string; value: any }) => void;
  name: string;
  label: string;
  defaultValue?: any;
}

const MultiSelectField = ({
  options,
  onChange,
  name,
  label,
  defaultValue,
}: MultiSelectFieldProps) => {
  const handleChange = (newValue: MultiValue<OptionType>) => {
    const selectedValues = newValue
      ? newValue.map((option) => option.value)
      : [];
    onChange({ name: name, value: selectedValues });
  };

  return (
    <div className="mb-4">
      <label className="form-label fw-bold">{label}</label>
      <Select
        isMulti
        defaultValue={defaultValue}
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
