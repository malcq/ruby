import React from 'react';
import styled from 'styled-components';

import TimePickerInput from './TimePickerInput';
import { getFancyTime } from '../../utils';

type Props = {
    placeholder?: string,
    selectedValue?: string,
    onChange: (option: string) => void,
};

const TimePickerMobile: React.FC<Props> = (props) => {
  const { selectedValue, placeholder } = props;
  const [fancyTime, setFancyTime] = React.useState(getFancyTime(selectedValue));

  function onTimeChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const selectedValue = event.target.value;

    if (!selectedValue) { return; }
    setFancyTime(getFancyTime(selectedValue));

    return props.onChange(selectedValue);
  }

  return (
    <>
        <TimePickerInput
            placeholder={placeholder}
            selectedValue={fancyTime}
            active={false}
            onInputClick={()=>({})}
        />
        <StyledContainer>

        <TimePicker
            className="time-picker"
            onChange={onTimeChange}
            value={selectedValue || ''}
        />
        </StyledContainer>
    </>
  );
}

const StyledContainer = styled.div`
  height: 50px;
  margin-top: -50px;
  & .time-picker {
    opacity: 0;
    display: block;
    -moz-appearance: none; 
    -webkit-appearance: none; 
    appearance: none;
    ${props => props.theme.typography.fnRegular};
    ${props => props.theme.typography.fnCaption};
    outline: none;
    border: 0px;
    height: 100%;
    width: 100%;
  }
`;

const TimePicker = ({
  onChange,
  className,
  value
}: { onChange: (event: React.ChangeEvent<HTMLInputElement>) => void, className: string, value: string }) => (
  <input
    className={className}
    onChange={onChange}
    value={value}
    type="time"
    step="900"
  />
);



export default TimePickerMobile;
