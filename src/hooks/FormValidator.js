import { useState, useEffect } from "react";

export const useValidation = (value, validations) => {
  const [isEmpty, setEmpty] = useState(true)
  const [minLengthError, setMinLengthError] = useState(false)
  const [maxLengthError, setMaxLenghtError] = useState(false)
  const [urlError, setUrlError] = useState(false)
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
      }
    }

  }, [value])

  useEffect(() => {
    if (isEmpty || minLengthError || maxLengthError || urlError) {
      setInputValid(false)
    } else {
      setInputValid(true)
    }
  }, [isEmpty, minLengthError, maxLengthError, urlError])

  return {
    isEmpty,
    minLengthError,
    maxLengthError,
    urlError,
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
    onChange,
    onFocus,
    isDirty,
    resetValidation,
    ...valid
  }
}


