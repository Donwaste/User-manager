import Select from "react-select";

const MultiSelectField = ({ options, onChange, name, label, defaultValue }) => {
  const isObject =
    typeof options === "object" && !Array.isArray(options) && options !== null;

  const optionsArray = isObject
    ? Object.keys(options).map((optionName) => ({
        label: options[optionName].name,
        value: options[optionName]._id,
      }))
    : options;

  const handleChange = (value) => {
    onChange({ name: name, value });
  };

  return (
    <div className="mb-4">
      <label className="form-label fw-bold">{label}</label>
      <Select
        isMulti
        defaultValue={defaultValue}
        options={optionsArray}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={handleChange}
        name={name}
      />
    </div>
  );
};

export default MultiSelectField;
