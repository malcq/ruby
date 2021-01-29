import React from 'react';
import styled from 'styled-components';
import { Form, Field } from 'react-final-form';
import { ICustomFormField } from '../../../../models/custom-form';

import MultilineForm from './MultilineForm';

enum EFormType {
  multiline = 'multiline',
  oneline = 'oneline',
  none = 'none',
};

type DynamicFormValues = {
  [data_type: string]: string,
};

type Props = {
  fields: ICustomFormField[],
  onSubmit: (values: DynamicFormValues) => any,
};
const CustomForm: React.FC<Props> = (props) => {
  function onSubmit(values: DynamicFormValues) {
    return props.onSubmit(values);
  }

  const formType: EFormType = React.useMemo((): EFormType => {
    if (props.fields.length <= 0) { return EFormType.none; }
    if (props.fields.length === 1) { return EFormType.oneline; }
    return EFormType.multiline;
  }, [props.fields]);

  switch (formType) {
    case EFormType.multiline:
      return (
        <MultilineForm
          fields={props.fields}
          onSubmit={onSubmit}
        />
      );
    case EFormType.oneline:
    case EFormType.none:
    default:
      return null;
  }
}

const StyledContainer = styled.div`
`;

const StyledForm = styled.form`
  margin-bottom: 81px;

  & > div {
    margin-bottom: 16px;
  }

  & > div:last-child {
    margin-bottom: 0;
  }
`;


export default CustomForm;

