interface ValidatorRule {
  message: string;
  value?: number;
}

type ValidatorConfig<T> = Partial<
  Record<keyof T, Record<string, ValidatorRule>>
>;

export function validator<T>(data: T, config: ValidatorConfig<T>) {
  const errors: Partial<Record<keyof T, string>> = {};
  const validate = (
    validateMethod: string,
    data: unknown,
    config: ValidatorRule,
  ): string | undefined => {
    let statusValidate: boolean | undefined;

    switch (validateMethod) {
      case "isRequired": {
        if (typeof data === "boolean") {
          statusValidate = !data;
        } else {
          statusValidate = String(data).trim() === "";
        }
        break;
      }
      case "isEmail": {
        const emailRegExp = /^\S+@\S+\.\S+$/g;
        statusValidate = !emailRegExp.test(String(data));
        break;
      }
      case "isCapital": {
        const capitalRegExp = /[A-Z]+/g;
        statusValidate = !capitalRegExp.test(String(data));
        break;
      }
      case "isContainDigit": {
        const containDigitRegExp = /\d+/g;
        statusValidate = !containDigitRegExp.test(String(data));
        break;
      }
      case "min": {
        statusValidate = String(data).length < (config.value ?? 0);
        break;
      }
      default:
        break;
    }
    if (statusValidate) return config.message;
  };
  for (const fieldName in data) {
    const fieldConfig = config[fieldName as keyof T];
    if (!fieldConfig) continue;

    for (const validateMethod in fieldConfig) {
      const error = validate(
        validateMethod,
        data[fieldName],
        fieldConfig[validateMethod],
      );
      if (error && !errors[fieldName]) {
        errors[fieldName] = error;
      }
    }
  }
  return errors;
}
