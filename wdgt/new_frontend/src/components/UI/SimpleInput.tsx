import React from 'react';
import styled from 'styled-components';

export type InputStatus = 'valid' | 'invalid' | 'pristine';

type Props = {
  value: string,
  className?: string,
  onChange?: (event: any) => void,
  name?: string,
  error?: any,
  placeholder?: string,
};
const SimpleInput: React.FC<Props> = (props) => {
  const {
    value,
    onChange,
    className,
    error,
    name,
    placeholder,
  } = props;

  const inputStatus = React.useMemo((): InputStatus => {
    if (error) { return 'invalid'; }

    if (!value || !value.trim().length) {
      return 'pristine';
    }

    return 'valid';
  }, [error, value]);

  return (
    <StyledContainer
      className={className}
      status={inputStatus}
    >
      <StyledInput
        value={value}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
      />
    </StyledContainer>
  );
}

type StyledContainerProps = {
  status?: InputStatus,
}
const StyledContainer = styled.div<StyledContainerProps>`
  width: 100%;
  padding: 0 18px;
  min-height: 45px;
  justify-content: center;
  border: 1px solid;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-color: ${(props) => {
    switch (props.status) {
      case 'valid':
        return props.theme.colorValues.lightgrey;
      case 'invalid':
        return props.theme.colorValues.error;
      case 'pristine':
      default:
        return props.theme.colorValues.lightgrey;
    }
  }};

  &:focus-within {
    border-color: ${(props) => {
      switch (props.status) {
        case 'valid':
          return props.theme.colorValues.primary;
        case 'invalid':
          return props.theme.colorValues.error;
        case 'pristine':
        default:
          return props.theme.colorValues.primary;
      }
    }};
  }
`;

const StyledInput = styled.input`
    border: none;
    background-image:none;
    background-color:transparent;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    width: 100%;
    padding: 0;
    min-height: 20px;
    ${props => props.theme.typography.fnCaption};
    ${props => props.theme.typography.fnRegular};

    &:focus {
      outline: none;
    }
`;

export default SimpleInput;