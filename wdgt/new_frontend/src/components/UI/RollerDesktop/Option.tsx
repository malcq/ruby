import React from 'react';
import { IOption } from '../../../models/select';

import styled from 'styled-components';

type Props = {
  option: IOption;
  onOptionClick?: (option: IOption) => any;
};
const Option: React.FC<Props> = (props) => {
  const { option } = props;

  function onOptionClick() {
    if (!props.onOptionClick) { return; }
    props.onOptionClick(option);
  }

  return (
    <StyledContainer
      onClick={onOptionClick}
      title={option.title}
    >
      {option.title}
    </StyledContainer>
  )
};

const StyledContainer = styled.p`
  padding: 5px 20px;
  margin: 0;
  user-select: none;
  cursor: pointer;
  color: ${props => props.theme.colorValues.black};
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