import React from 'react';
import styled from 'styled-components';

import { IOption } from '../../../models/select';

import Option from './Option';

type Props = {
  values: IOption[],
  selected?: IOption,
  onOptionClick?: (option: IOption) => any;
};
const OptionList: React.FC<Props> = (props) => {
  const {
    values,
    selected,
  } = props;

  return (
    <StyledContainer>
      <StyledList>
        {values.map((item) => {
          return (
          <li key={item.id}>
            <Option
              option={item}
              selected={!!selected && item.id === selected.id}
              onOptionClick={props.onOptionClick}
            />
          </li>
          )
        })}
      </StyledList>
    </StyledContainer>
  )
};

const StyledContainer = styled.div`
  padding: 10px 0;
  width: 100%;
  overflow: auto;
`;

const StyledList = styled.ul`
  padding: 0;
  margin: 0;
  list-style-type: none;

  & > li { }
`;

export default OptionList;