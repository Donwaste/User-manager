const SelectField = ({
  label,
  value,
  onChange,
  defaultOption,
  options,
  error,
  name,
}) => {
  const isObject =
    typeof options === "object" && !Array.isArray(options) && options !== null;

  const optionsArray = isObject
    ? Object.keys(options).map((optionName) => ({
        name: options[optionName].name,
        value: options[optionName]._id,
      }))
    : options;

  const handleChange = ({ target }) => {
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

        {optionsArray &&
          optionsArray.map((option) => (
            <option
              key={option.value || option._id}
              value={option.value || option._id}
            >
              {option.name}
            </option>
          ))}
      </select>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default SelectField;
