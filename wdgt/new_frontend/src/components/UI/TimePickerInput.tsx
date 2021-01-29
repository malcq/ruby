import React from 'react';
import styled, { css } from 'styled-components';

import DropdownIcon from './icons/DropdownIcon';

type Props = {
  placeholder?: string;
  selectedValue?: string;
  active?: boolean;
  onInputClick?: () => any;
};
const TimePickerInput: React.FC<Props> = (props) => {
  const {
    placeholder,
    active,
    selectedValue,
    onInputClick,
  } = props;

  const filled = !!selectedValue;

  const title = React.useMemo((): string => {
    if (!selectedValue && !placeholder) { return ''; }

    if (selectedValue) { return selectedValue; };

    if (!placeholder) { return ''; }

    return placeholder;
  }, [placeholder, selectedValue]);

  return (
    <StyledContainer
      filled={filled}
      active={active}
      onClick={onInputClick}
    >
      <p className="time-picker-input__title" title={title}>
        {title}
      </p>
      <div className="roller-input__dropdown-icon">
        <DropdownIcon />
      </div>
    </StyledContainer>
  );
};

type StyledContainerProps = {
  active?: boolean;
  filled?: boolean;
};
const StyledContainer = styled.div<StyledContainerProps>`
  border-radius: 28px;
  min-height: 45px;
  transition: 0.2s;
  border: 1px solid;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 13px 24px 15px 20px;
  cursor: pointer;

  ${props => props.active || props.filled
    ? css`
      border-color: ${props => props.theme.colorValues.primary};
    `
    : css`
      border-color: ${props => props.theme.colorValues.lightgrey};
    `
  };


  ${props => props.filled
    ? css`
      color: ${props => props.theme.colorValues.black};
    `
    : css`
      color: ${props => props.theme.colorValues.grey};
    `
  };

  .time-picker-input {
    &__title {
      ${props => props.theme.typography.fnRegular};
      ${props => props.theme.typography.fnCaption};
      color: inherit;
      margin: 0;
      padding: 0;
      flex-grow: 1;
      margin-right: 5px;
      user-select: none;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__dropdown-icon {
      transition: 0.2s;
      ${props => props.active
        ? css`
          transform: rotate(180deg);
        `
        : css`
          transform: rotate(0deg);
        `
      };
    }

    &__dropdown-icon > svg {
      display: block;
    }
  }


`;

export default TimePickerInput;
