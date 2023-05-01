import { useState, useEffect } from "react";

export const isPasswordMatch = (value, compareValue) => {
  return value === compareValue;
};

export const useValidation = (value, validations, password) => {
  const [isEmpty, setEmpty] = useState(true)
  const [minLengthError, setMinLengthError] = useState(false)
  const [maxLengthError, setMaxLenghtError] = useState(false)
  const [urlError, setUrlError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [passwordMatchError, setPasswordMatchError] = useState(false)
  const [inputValid, setInputValid] = useState(false)

  useEffect(() => {
    for (const validation in validations) {
      switch (validation) {
        case 'minLength':
          value.length < validations[validation] ? setMinLengthError(true) : setMinLengthError(false)
          break;
        case 'maxLength':
          value.length > validations[validation] ? setMaxLenghtError(true) : setMaxLenghtError(false)
          break;
        case 'isEmpty':
          value ? setEmpty(false) : setEmpty(true)
          break;
        case 'isUrl':
          const pattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
          setUrlError(!pattern.test(value));
          break;
        case 'isEmail':
          const patternEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
          setEmailError(!patternEmail.test(value));
          break;
          case 'isPasswordMatch':
            isPasswordMatch(value, password) ? setPasswordMatchError(false) : setPasswordMatchError(true);
            break;
      }
    }
  }, [value, password])

  useEffect(() => {
    if (isEmpty || minLengthError || maxLengthError || urlError || emailError || passwordMatchError) {
      setInputValid(false)
    } else {
      setInputValid(true)
    }
  }, [isEmpty, minLengthError, maxLengthError, urlError, emailError, passwordMatchError])

  return {
    isEmpty,
    minLengthError,
    maxLengthError,
    urlError,
    emailError,
    passwordMatchError,
    inputValid
  }
}

export const useInput = (initialValue, validations) => {
  const [value, setValue] = useState(initialValue)
  const [isDirty, setDirty] = useState(false)
  const valid = useValidation(value, validations)

  const onChange = (e) => {
    setValue(e.target.value)
  }

  const onFocus = (e) => {
    setDirty(true)
  }

  const resetValidation = () => {
    setDirty(false);
    setValue(initialValue); // добавить сброс значения в исходное
  };

  return {
    value,
    isDirty,
    onChange,
    onFocus,
    resetValidation,
    ...valid
  }
}
