import React from 'react';
import styled from 'styled-components';

import CloseIcon from './icons/CloseIcon';
import SearchIcon from './icons/SearchIcon';

type Props = {
  value: string,
  onChange: (value: string) => void,
  className?: string,
  onClearSearch?: () => void,
  placeholder?: string,
  autofocus?: boolean,
};
const SearchInput: React.FC<Props> = (props) => {
  const notEmpty = props.value.length > 0;
  const inputRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;

  function onSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    props.onChange(value);
  }

  function onIconClick() {
    if (!notEmpty) { return; }
    if (!props.onClearSearch) { return; }
    props.onClearSearch();
  }

  React.useEffect(() => {
    if (props.autofocus) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 1000)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledContainer
      className={props.className}
      selected={notEmpty}
    >
      <StyledInput
        value={props.value}
        onChange={onSearchChange}
        placeholder={props.placeholder}
        ref={inputRef}
      />
      <IconContainer
        selected={notEmpty}
        onClick={onIconClick}
      >
        {notEmpty
          ? (
            <CloseIcon
              width="14px"
              height="14px"
             />
          )
          : (
            <SearchIcon
              width="18px"
              height="18px"
            />
          )
        }
      </IconContainer>
    </StyledContainer>
  );
};

type StyledContainerProps = {
  selected?: boolean;
}
const StyledContainer = styled.div<StyledContainerProps>`
  display: flex;
  padding: 12px 19px;
  border: 1px solid;
  border-color: ${props => props.theme.colorValues.lightgrey};
  border-radius: 28px;
  transition: 0.2s;
  min-height: 50px;

  &:focus-within {
    border-color: ${props => props.theme.colorValues.primary};
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

  &:focus {
      outline: none;
  }
`;

type IconContainerProps = {
  selected?: boolean;
}
const IconContainer = styled.div<IconContainerProps>`
  display: flex;
  justify-content: center;
  align-items: center;

  cursor: ${props => props.selected ? 'pointer' : 'unset'};
`;

export default SearchInput;
