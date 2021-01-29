import React from 'react';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';

import { IOption } from '../../../models/select';

import TimePickerInput from '../TimePickerInput';
import OptionList from './OptionList';

import { getFancyTime } from '../../../utils';

type Props = {
  placeholder?: string,
  selectedValue?: string,
  onChange: (option: string) => void,
};
const TimePickerDesktop: React.FC<Props> = (props) => {
  const {
    placeholder,
    selectedValue,
  } = props;

  let selectedHours = 0;
  let selectedMinutes = 0;
  let pm = 0;
  if(selectedValue) {
    const timeParts = selectedValue.split(':');
    selectedHours = parseInt(timeParts[0]);
    selectedMinutes = parseInt(timeParts[1]);
  }
  if(selectedHours>11) {
    selectedHours -= 12;
    pm = 1;
  }

  const times: IOption[] = [];
  let selectedTime: IOption | undefined;

  for(let hours = 0; hours<12; hours++) {
    for(let minutes = 0; minutes<60; minutes+=15) {
      const time = (hours<10? '0': '')+hours+':'+(minutes<10? '0': '')+minutes;
      const title = (!hours? '12': (hours<10? '0': '')+hours)+':'+(minutes<10? '0': '')+minutes;
      const option = {
        id: time,
        title
      };
      if(selectedValue && hours === selectedHours && minutes===selectedMinutes) {
        selectedTime = option;
      }
      times.push(option);
    }
  }
  const dayParts = [
    {id:'am', title: 'Morning'},
    {id:'pm', title: 'Afternoon'}
  ];

  const [selectedDP, setSelectedDP] = React.useState(dayParts[pm]);
  const [isOpen, setOpen] = React.useState(false);

  function onInputClick() {
    setOpen(prevState => !prevState);
  }

  function onDPChange(option: IOption) {
    pm = option.id==='pm' ? 1 : 0;
    setSelectedDP(dayParts[pm]);
  }

  function onTimeChange(option: IOption) {
    setOpen(false);
    const timeParts = option.id.split(':');
    let hours = parseInt(timeParts[0]);
    let minutes = parseInt(timeParts[1]);
    console.debug(pm, option);
    if(selectedDP.id === 'pm') {
      hours += 12;
    }
    props.onChange((hours<10? '0': '')+hours+':'+(minutes<10? '0': '')+minutes);
  }

  return (
    <StyledContainer>
      <TimePickerInput
        placeholder={placeholder}
        selectedValue={getFancyTime(selectedValue)}
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
        <OptionsContainer>
          <PmContainer>
            <OptionList
              selected={selectedDP}
              values={dayParts}
              onOptionClick={onDPChange}
            />
          </PmContainer>
          <div className="divider" />
          <TimeContainer>
            <OptionList
              selected={selectedTime}
              values={times}
              onOptionClick={onTimeChange}
            />
          </TimeContainer>
        </OptionsContainer>
      </CSSTransition>
    </StyledContainer>
  );
}




const PmContainer = styled.div`
  height: 71px;
`;

const TimeContainer = styled.div`
  height: 250px;
  overflow-y: scroll;
`;

const StyledContainer = styled.div`
  position: relative;
`;

const OptionsContainer = styled.div`
  width: 240px;
  overflow: visible;
  position: absolute;
  height: 322px;
  bottom: 65px;
  right: 0;

  border-radius: 2px;
  background-color: white;
  box-shadow: 0px 10px 20px 0 rgba(0,0,0, 0.19);

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

  .divider {
    width: 100%;
    background-color: #f2f2f3;
    height: 1px;
  }
`;

export default TimePickerDesktop;
