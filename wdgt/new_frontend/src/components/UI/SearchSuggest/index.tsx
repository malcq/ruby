import React from 'react';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';

import SearchInput from '../SearchInput';
import RootPortal from '../RootPortal';
import { ContinueButton } from '../Buttons';

import OptionList from './OptionList';

import { IOption } from '../../../models/select';

import { search } from '../../../api/search';
import memoize from 'memoize-one';

function getSearchInitialValue(initialValue?: string): string {
  if (!initialValue) { return ''; }

  return initialValue.trim();
}

type Props = {
  initialValue?: string;
  onConfirm: (value: string) => any;
  placeholder?: string;
  values: IOption[];
  searchId: string;
}
type State = {
  values: IOption[];
  searchValue: string;
}
class SearchSuggest extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      values: [],
      searchValue: getSearchInitialValue(props.initialValue),
    }
  }

  componentDidMount() {
    if (this.state.searchValue) {
      this.changeSearch(this.state.searchValue);
    }
  }

  getCanContinue = memoize(
    (searchValue: string): boolean => {
      if (!searchValue) { return false; }
      if (!searchValue.trim().length) { return false; }
      return true;
    }
  );


  changeSearch = async (value: string) => {
    this.setState({
      searchValue: value,
    });
    try {
      const newValues = await search(this.props.searchId, value);
      this.setState({
        values: newValues,
      })
    } catch (e) {
      if(e.message !== 'Search canceled') {
        console.debug(e);
      } else {
        console.debug('Search canceled');
      }
    }
  }

  onClearSearch = () => {
    this.changeSearch('');
  }

  onConfirmSelection = () => {
    this.props.onConfirm(this.state.searchValue.trim());
  }

  onOptionClick = (option: IOption) => {
    this.changeSearch(option.title);
    this.props.onConfirm(option.title);
  };

  onCopyToSearchClick = (option: IOption) => {
    this.changeSearch(option.title);
  };

  render() {
    const canContinue = this.getCanContinue(this.state.searchValue);

    return (
      <StyledContainer>
        <StyledSearchInput
          autofocus
          onChange={this.changeSearch}
          onClearSearch={this.onClearSearch}
          value={this.state.searchValue}
          placeholder={this.props.placeholder}
        />
  
        <OptionList
          searchValue={this.state.searchValue}
          values={this.state.values}
          onOptionClick={this.onOptionClick}
          onCopyToSearchClick={this.onCopyToSearchClick}
        />
  
        <RootPortal>
          <CSSTransition
            unmountOnExit={true}
            timeout={200}
            classNames="continue-button"
            in={canContinue}
          >
            <ContinueButton
              onClick={this.onConfirmSelection}
            >
              Continue
            </ContinueButton>
          </CSSTransition>
        </RootPortal>
      </StyledContainer>
    );
  }
}

const StyledContainer = styled.div`

`;

const StyledSearchInput = styled(SearchInput)`
  margin: 0 24px 24px 24px;
`;


export default SearchSuggest;
