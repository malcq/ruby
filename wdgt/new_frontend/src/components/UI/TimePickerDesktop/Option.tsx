import React from 'react';
import { IOption } from '../../../models/select';

import styled from 'styled-components';

type Props = {
  option: IOption;
  selected: boolean;
  onOptionClick?: (option: IOption) => any;
};
const Option: React.FC<Props> = (props) => {
  const { option, selected } = props;

  function onOptionClick() {
    if (!props.onOptionClick) { return; }
    props.onOptionClick(option);
  }

  return (
    <StyledContainer
      selected={selected}
      onClick={onOptionClick}
      title={option.title}
    >
      {option.title}
    </StyledContainer>
  )
};

type ContentContainerProps = {
  selected?: boolean,
}
const StyledContainer = styled.p<ContentContainerProps>`
  padding: 5px 20px;
  margin: 0;
  user-select: none;
  cursor: pointer;
  color: ${props => props.selected
    ? props.theme.colorValues.primary
    : props.theme.colorValues.black
  };
  ${props => props.theme.typography.fnCaption};
  ${props => props.theme.typography.fnRegular};
  transition: 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  :hover {
    color: ${props => props.theme.colorValues.primary};
  }
`;

export default Option;