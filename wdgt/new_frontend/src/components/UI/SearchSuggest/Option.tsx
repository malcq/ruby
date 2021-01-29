import React from 'react';
import styled from 'styled-components';
import Highlighter from "react-highlight-words";

import { IOption } from '../../../models/select';

import SearchIcon from '../icons/SearchIcon';
import ArrowTopLeftIcon from '../icons/ArrowTopLeftIcon';

type Props = {
  option: IOption;
  searchValue: string;
  onOptionClick?: (option: IOption) => any;
  onCopyToSearchClick?: (option: IOption) => any;
};
const Option: React.FC<Props> = (props) => {
  const {
    searchValue,
    option,
  } = props;

  function onOptionClick() {
    if (!props.onOptionClick) { return; }
    props.onOptionClick(option);
  }
  function onCopyToSearchClick() {
    if (!props.onCopyToSearchClick) { return; }
    props.onCopyToSearchClick(option);
  }

  return (
    <StyledContainer>
      <div className="search-option__glass-icon" onClick={onOptionClick}>
        <SearchIcon
          width="18px"
          height="18px"
          color="#7f7f7f"
        />
      </div>
      <div
        className="search-option__title"
        onClick={onOptionClick}>
        <Highlighter
          highlightClassName="search-option__mark"
          textToHighlight={option.title}
          searchWords={[searchValue]}
        />
      </div>
      <div className="search-option__arrow-icon" onClick={onCopyToSearchClick}>
        <ArrowTopLeftIcon
          height="20px"
          width="20px"
          color="#7f7f7f"
        />
      </div>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  cursor: pointer;
  height: 53px;
  display: flex;
  align-items: center;
  padding: 0 32px;

  ${props => props.theme.typography.fnMedium};
  ${props => props.theme.typography.fnCaption};

  display: flex;
  flex-direction: row;

  .search-option {

    &__glass-icon {
      margin-right: 10px;
      margin-top: 4px;
    }

    &__title {
      flex-grow: 1;
      margin-right: 10px;
      user-select: none;
    }

    &__mark {
      background-color: inherit;
      color: ${props => props.theme.colorValues.primary};
    }

    &__arrow-icon {
      margin-top: 4px;
    }
  }
`;


export default Option;
