import React from 'react';
import styled from 'styled-components';

import { IOption } from '../../../models/select';

import Option from './Option';

type Props = {
  values: IOption[],
  onOptionClick?: (option: IOption) => any;
};
const OptionList: React.FC<Props> = (props) => {
  const {
    values,
  } = props;

  return (
    <StyledContainer>
      <StyledList>
        {values.map((item) => {
          return (
          <li key={item.id}>
            <Option
              option={item}
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
  height: 100%;
  background-color: white;
  overflow: auto;

  border-radius: 2px;
  box-shadow: 0px 10px 20px 0 rgba(0,0,0, 0.19);
`;

const StyledList = styled.ul`
  padding: 0;
  margin: 0;
  list-style-type: none;

  & > li { }
`;

export default OptionList;