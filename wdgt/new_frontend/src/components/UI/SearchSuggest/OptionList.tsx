import React from 'react';
import styled from 'styled-components';

import Option from './Option';

import { IOption } from '../../../models/select';

type Props = {
  values: IOption[];
  searchValue: string;
  onOptionClick?: (option: IOption) => any;
  onCopyToSearchClick?: (option: IOption) => any;
};
const OptionList: React.FC<Props> = (props) => {
  return (
    <StyledList>
      {props.values.map((option) => {
        return (
          <li key={option.id}>
            <Option
              option={option}
              searchValue={props.searchValue}
              onOptionClick={props.onOptionClick}
              onCopyToSearchClick={props.onCopyToSearchClick}
            />
          </li>
        );
      })}
    </StyledList>
  );
}

const StyledList = styled.ul`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 0;
  margin: 0;
  list-style-type: none;
  border-top: 1px solid rgba(0,0,0,0.1);
  padding-top: 8px;
`;

export default OptionList;
