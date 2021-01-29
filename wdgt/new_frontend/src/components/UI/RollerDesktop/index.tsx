import React from 'react';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';

import { IOption } from '../../../models/select';

import RollerInput from './RollerInput';
import OptionList from './OptionList';

type Props = {
  values: IOption[],
  placeholder?: string,
  selectedValue?: IOption;
  onChange?: (option: IOption) => any;
};
const RollerDesktop: React.FC<Props> = (props) => {
  const {
    placeholder,
    selectedValue,
    values,
  } = props;

  const [isOpen, setOpen] = React.useState(false);

  function onInputClick() {
    setOpen(prevState => !prevState);
  }

  function onOptionChange(option: IOption) {
    setOpen(false);
    if (props.onChange) {
      props.onChange(option);
    }
  }

  return (
    <StyledContainer>
      <RollerInput
        placeholder={placeholder}
        selectedValue={selectedValue}
        active={isOpen}
        onInputClick={onInputClick}
      />
      <CSSTransition
        in={isOpen}
        classNames="option-list"
        timeout={{
          exit: 300,
          enter: 300,
        }}
        unmountOnExit
      >
        <OptionsContainer fixedHeight={values.length > 7}>
          <OptionList
            values={values}
            onOptionClick={onOptionChange}
          />
        </OptionsContainer>
      </CSSTransition>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  position: relative;
`;

type OptionsContainer = {
  fixedHeight?: boolean;
}
const OptionsContainer = styled.div<OptionsContainer>`
  width: 240px;
  max-height: 216px;
  overflow: visible;
  position: absolute;
  height: ${props => props.fixedHeight ? '216px' : 'unset'};
  bottom: 55px;
  right: 0;

  &.option-list-enter {
    opacity: 0;
    transform: translateY(10px);
  }

  &.option-list-enter-active {
    opacity: 1;
    transition: 0.3s;
    transform: translateY(0);
  }

  &.option-list-exit {
    opacity: 1;
    transform: translateY(0);
  }
  &.option-list-exit-active {
    opacity: 0;
    transform: translateY(10px);
    transition: 0.3s;
  }
`;

export default RollerDesktop;
