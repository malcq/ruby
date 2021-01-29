import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import styled, { css } from 'styled-components';

import { SendButton } from './Buttons';

function isSendVisible(value: string): boolean {
  if (!value) { return false; }
  const trimmedValue = value.trim();
  if (!trimmedValue) { return false; }
  return true;
}

type Props = {
  maxRows?: number;
  placeholder?: string;
  value: string;
  disabled?: boolean;
  onChange: (...args: any[]) => void;
  onSend: (value: string) => void;
  onAreaClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  className?: string;
  autofocus?: boolean;
}
const AutoresizeInput: React.FC<Props> = (props) => {
  const {
    maxRows,
    disabled,
  } = props;

  const sendVisible = React.useMemo(() => {
    return isSendVisible(props.value);
  }, [props.value]);

  let inputRef = React.useRef<HTMLTextAreaElement>();

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

  function onKeyPress(ev: React.KeyboardEvent<HTMLTextAreaElement>): void {
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
    >
      <TextareaAutosize
        disabled={disabled}
        maxRows={maxRows}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
        className="autoresize-input__input"
        onKeyDown={onKeyPress}
        inputRef={ref => inputRef.current = ref}
      />

      <StyledSendButton
        className="autoresize-input__send-button"
        onClick={onSend}
        visible={sendVisible}
      />

    </StyledContainer>
  )
};

type ContainerProps = {
  disabled?: boolean;
}
const StyledContainer = styled.div<ContainerProps>`
  border: 1px solid;
  border-color: ${props => props.theme.colorValues.lightgrey};
  display: flex;
  transition: 0ms;
  border-radius: 24px;
  padding: 10px 16px 12px 20px;
  /* transition: 0.6s; */
  background-color: transparent;

  &:focus-within {
    border-color: ${props => props.theme.colorValues.primary};
  }

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

type StyledSendButton = {
  visible?: boolean;
}
const StyledSendButton = styled(SendButton)<StyledSendButton>`
  visibility: ${props => props.visible ? null : 'hidden' };
`;

AutoresizeInput.defaultProps = {
  maxRows: 7,
  disabled: false,
  onAreaClick: (ev) => null,
};

export default AutoresizeInput;
