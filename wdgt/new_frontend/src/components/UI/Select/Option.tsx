import React from 'react';
import styled, { css } from 'styled-components';
import Highlighter from "react-highlight-words";

import ConfirmationIcon from '../icons/ConfirmationIcon';

import { IOption } from '../../../models/select';

type OptionProps = {
  option: IOption,
  selected: {
    [optionId: string]: boolean,
  },
  searchValue: string,
  onSelectItem?: (option: IOption) => void,
  multiselect?: boolean,
}
const Option: React.FC<OptionProps> = (props) => {
  const {
    option,
    selected,
    searchValue,
    multiselect,
  } = props;
  const { id: optionId, title } = option;

  const isSelected = !!selected[optionId];

  function onSelectItem() {
    if (!props.onSelectItem) { return; }
    props.onSelectItem(option);
  }

  return (
      <StyledContainer
        onClick={onSelectItem}
      >
        <ContentContainer selected={isSelected}>
          <Highlighter
            highlightClassName="select-option__mark"
            textToHighlight={title}
            searchWords={[searchValue]}
            className="select-option__title"
          />
          <IconContainer>
            {(isSelected || multiselect) 
              ? (
                <ConfirmationIcon
                  checked={isSelected}
                />
              )
              : (
                <BlankConfirmationIcon />
              )
            }
          </IconContainer>
        </ContentContainer>

        <BottomBorder
          selected={isSelected}
        />
      </StyledContainer>
  )
}

const StyledContainer = styled.div`
  padding: 21px 32px 0 32px;
  cursor: pointer;
`;

type ContentContainerProps = {
  selected?: boolean,
}
const ContentContainer = styled.div<ContentContainerProps>`
  display: flex;

  ${props => props.theme.typography.fnCaption};
  ${props => props.theme.typography.fnMedium};
  
  & > .select-option__title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-right: 10px;
    flex-grow: 1;
    color: ${props => props.selected
      ? props.theme.colorValues.primary
      : props.theme.colorValues.black
    };
    transition: 0.4s;
  }

  & .select-option__mark {
    background-color: inherit;
    color: ${props => props.theme.colorValues.primary};
  }
`;

Option.defaultProps = {
  onSelectItem: () => null,
  searchValue: '',
  multiselect: false,
}

const IconContainer = styled.div`
  & > svg {
    display: block;
  }
`;

const BlankConfirmationIcon = styled.div`
  width: 20px;
  height: 20px;
  background-color: transparent;
`;

type BottomBorderProps = {
  selected?: boolean;
}
const BottomBorder = styled.div<BottomBorderProps>`
  margin-top: 11px;
  transition: 0.2s;
  height: 1px;
  ${props => props.selected
    ? css`
      width: 100%;
      background-color: ${props => props.theme.colorValues.primary};
    `
    : css`
      background-color: ${props => props.theme.colorValues.lightgrey};
      width: 40px;
    `
  }
`;

export default Option;