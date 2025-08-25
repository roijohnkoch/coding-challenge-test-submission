import { useState } from 'react';
import { FormFieldsInitialValue } from 'src/types/hooks';

export const useFormState = (initialValue: FormFieldsInitialValue) => {
  const [fieldValues, setFieldValues] = useState(initialValue);

  const handleChange = (fieldName: string) => (event?: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValues((prevValue) => ({
      ...prevValue,
      [fieldName]: event ? event.target.value : '',
    }));
  };

  const clearForm = () => {
    const cleared = Object.keys(initialValue).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {} as FormFieldsInitialValue);

    setFieldValues(cleared);
  };

  return {
    fieldValues,
    handleChange,
    clearForm,
  };
}
