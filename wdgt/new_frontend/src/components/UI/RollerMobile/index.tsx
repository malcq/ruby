import React from 'react';
import styled from 'styled-components';

import { IOption } from '../../../models/select';


type Props = {
  values: IOption[],
  onChange: (option: IOption) => any,
  selectedValue?: IOption,
};
const RollerMobile: React.FC<Props> = (props) => {
  const { values, selectedValue } = props;

  const selectedId = React.useMemo(() => {
    if (!selectedValue) { return undefined; }
    return selectedValue.title;
  }, [selectedValue])

  function onRollerChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedId = event.target.value;

    const selectedValue = values.find((item) => {
      return `${item.title}` === selectedId
    });

    if (!selectedValue) { return; }

    return props.onChange(selectedValue);
  }

  return (
    <StyledContainer>
      <StyledSelect
        onChange={onRollerChange}
        value={selectedId}
      >
        <option
          selected
          disabled
          hidden
          style={{display: 'none'}}
          value=''
        ></option>
        {values.map((option) => {
          return (
          <option
            key={option.id}
            value={option.title}
          >
            {option.title}
          </option>
          )
        })}
      </StyledSelect>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  border-radius: 25px;
  border: 1px solid;
  border-color: ${props => props.theme.colorValues.lightgrey};
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  &:focus-within {
    border-color: ${props => props.theme.colorValues.primary};
  }
`;

const StyledSelect = styled.select`
  display: block;
  -moz-appearance: none; 
  -webkit-appearance: none; 
  appearance: none;
  ${props => props.theme.typography.fnCaption};
  outline: none;
  border: 0px;
  height: 100%;
  width: calc(100% - 40px);
`;

export default RollerMobile;
