import React from 'react';
import styled from 'styled-components';
import { IOption } from '../../../models/select';

import Option from './Option';

type Props = {
  selected: {
    [optionId: string]: boolean,
  },
  values: IOption[],
  onSelectItem: (option: IOption) => void,
  searchValue: string,
  multiselect?: boolean,
}
const OptionList: React.FC<Props> = (props) => {
  return (
    <StyledList>
        {props.values.map((option) => {
          return (
            <li key={option.id}>
              <Option
                option={option}
                selected={props.selected}
                onSelectItem={props.onSelectItem}
                searchValue={props.searchValue}
                multiselect={props.multiselect}
              />
            </li>
          )
        })}
    </StyledList>
  )
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
