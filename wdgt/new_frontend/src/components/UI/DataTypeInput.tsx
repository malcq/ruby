import React from 'react';
import styled, { css } from 'styled-components';

import { SendButton } from './Buttons';

function isSendVisible(value: string): boolean {
  if (!value) { return false; }
  const trimmedValue = value.trim();
  if (!trimmedValue) { return false; }
  return true;
}

type Props = {
  placeholder?: string;
  value: string;
  disabled?: boolean;
  onChange: (...args: any[]) => void;
  onSend: (value: string) => void;
  onAreaClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  className?: string;
  autofocus?: boolean;
  isError: boolean;
}
const DataTypeInput: React.FC<Props> = (props) => {
  const {
    disabled,
    isError,
  } = props;

  const sendVisible = React.useMemo(() => {
    return isSendVisible(props.value) && !isError;
  }, [props.value, isError]);

  let inputRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;

  React.useEffect(() => {
    if (inputRef.current && props.autofocus) {
      setTimeout(() => {
        if (!inputRef || !inputRef.current) { return; }
        inputRef.current.focus();
      }, 1000)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onSend(ev: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    props.onSend(props.value);
  }

  function onKeyPress(ev: React.KeyboardEvent<HTMLInputElement>): void {
    if (ev.shiftKey && ev.keyCode === 13) { return; }
    
    if(ev.keyCode === 13 && sendVisible){
      ev.preventDefault();
      props.onSend(props.value);
    }
  }

  return (
    <StyledContainer
      disabled={disabled}
      onClick={props.onAreaClick}
      className={props.className}
      isError={isError}
    >

      <StyledInput
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
        className="datatype-input__input"
        onKeyDown={onKeyPress}
        ref={inputRef}
      />
      
      <StyledSendButton
        className="datatype-input__send-button"
        onClick={onSend}
        visible={sendVisible}
      />

    </StyledContainer>
  )
};

type ContainerProps = {
  disabled?: boolean;
  isError?: boolean;
}
const StyledContainer = styled.div<ContainerProps>`
  border: 1px solid;
  border-color: grey;
  border-color: ${props => props.isError ? props.theme.colorValues.red : props.theme.colorValues.lightgrey};

  &:focus-within {
    /* border-color: red; */
    border-color: ${props => props.isError ? props.theme.colorValues.red : props.theme.colorValues.primary};
  }

  display: flex;

  border-radius: 24px;
  padding: 10px 16px 12px 20px;
  background-color: transparent;
  transition: width 2000ms, border-color 0ms !important;

  .autoresize-input {
    background-color: transparent;
    &__input {
      padding: 0;
      flex-grow: 1;
      outline: none;
      border: none;
      resize: none;
      ${props => props.theme.typography.fnRegular};
      ${props => props.theme.typography.fnCaption};
      margin-right: 20px;
      align-self: center;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
    }

    ${props => props.disabled
      ? css`
        color: ${props => props.theme.colorValues.grey};
      `
      : null
    };

    &__send-button {
      align-self: flex-end;
    }
  }

  ${props => props.disabled
    ? css`
      border-color: ${props => props.theme.colorValues.lightgrey};
      /* margin-left: 30px; */
    `
    : null
  }
`;

const StyledInput = styled.input`
  ${props => props.theme.typography.fnCaption};
  ${props => props.theme.typography.fnRegular};
  flex-grow: 1;
  display: block;
  background-color: inherit;
  border: none;
  margin-right: 5px;
  padding: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  &:focus {
      outline: none;
  }
`;

type StyledSendButton = {
  visible?: boolean;
}
const StyledSendButton = styled(SendButton)<StyledSendButton>`
  visibility: ${props => props.visible ? null : 'hidden' };
`;

DataTypeInput.defaultProps = {
  disabled: false,
  onAreaClick: (ev) => null,
};

export default DataTypeInput;
