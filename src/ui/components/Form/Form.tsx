import React, { FunctionComponent } from 'react';

import Button from '../Button/Button';
import InputText from '../InputText/InputText';
import $ from './Form.module.css';

interface FormEntry<T = Record<string, unknown>> {
  name: string;
  placeholder: string;
  extraProps: T & { value: string };
}

interface FormProps {
  label: string;
  loading: boolean;
  formEntries: FormEntry[];
  onFormSubmit: (event: React.ChangeEvent<HTMLFormElement>) => void | Promise<void>;
  submitText: string;
}

const Form: FunctionComponent<FormProps> = ({
  label,
  loading,
  formEntries,
  onFormSubmit,
  submitText
}) => {
  return (
    <form onSubmit={onFormSubmit}>
      <fieldset>
        <legend>{label}</legend>
        {formEntries.map(({ name, placeholder, extraProps }, index) => (
          <div key={`${name}-${index}`} className={$.formRow}>
            <InputText
              key={`${name}-${index}`}
              name={name}
              placeholder={placeholder}
              {...extraProps}
            />
          </div>
        ))}

        <Button loading={loading} type="submit">
          {submitText}
        </Button>
      </fieldset>
    </form>
  );
};

export default Form;
