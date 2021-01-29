import React from 'react';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import memoize from 'memoize-one';

import OptionList from './OptionList';

import SearchInput from '../SearchInput';
import { Button, ContinueButton } from '../Buttons';

import { IOption } from '../../../models/select';
import { search } from '../../../api/search';

import RootPortal from '../RootPortal';

type Props = {
  searchId: string,
  values: IOption[],
  initialSelected?: string[],
  multiselect?: boolean,
  enableSearch?: boolean,
  onContinue?: (selected: string[]) => any,
  selectedState?: boolean,
  onCancel?: () => any,
  placeholder?: string,
};

type State = {
  selected: {
    [optionId: string]: boolean,
  },
  searchValue: string,
  values: IOption[],
}
class SelectList extends React.Component<Props, State> {
  private searchId: string;
  constructor(props: Props) {
    super(props);
    this.searchId = props.searchId;

    let selected = {};

    if (props.initialSelected) {
      selected = getSelectedObjectFromArray(props.initialSelected);
    }

    this.state = {
      values: props.values,
      selected,
      searchValue: '',
    }
  }

  static defaultProps = {
    multiselect: false,
    enableSearch: false,
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.multiselect !== this.props.multiselect) {
      this.setState({
        selected: {}
      })
    }
  }

  onSelectItemSingle = (option: IOption) => {
    this.setState(prevState => {
      const prevSelected = !!prevState.selected[option.id];

      return {
        ...prevState,
        selected: {
          [option.id]: !prevSelected,
        }
      }
    })
  }

  onClearSearch = async () => {
    await this.onSearchChange('');
  }

  onSelectItemMultiple = (option: IOption) => {
    this.setState(prevState => {
      const prevSelected = !!prevState.selected[option.id];

      return {
        ...prevState,
        selected: {
          ...prevState.selected,
          [option.id]: !prevSelected,
        }
      }
    })
  }

  onSelectItem = (option: IOption) => {
    if (this.props.multiselect) {
      this.onSelectItemMultiple(option);
    } else {
      this.onSelectItemSingle(option);
    }
  }

  onSearchChange = async (value: string): Promise<void> => {
    try {
      const selectedOptions: IOption[] = this.state.values.reduce((acc: IOption[], option: IOption) => {
        if (this.state.selected[option.id]) {
          acc.push(option);
        }
        return acc;
      }, []);
      const searchOptions = await search(this.searchId, value);

      const seen = new Set<string>();
      const values: IOption[] = selectedOptions.concat(searchOptions).filter(option => seen.has(option.id) ? false : seen.add(option.id), true);

      this.setState({ searchValue: value, values });
    }
    catch(e) {
      if(e.message !== 'Search canceled') {
        console.debug(e);
      } else {
        console.debug('Search canceled');
      }
    }
  }

  checkDone = memoize(
    (selected: { [itemId: string]: boolean }): boolean => {
      // checking if `selected` has at least one `true` field

      const keys = Object.keys(selected);

      for (let i = 0; i < keys.length; i++) {
        const item = keys[i];
        const value = selected[item];

        if (value) { return true; }
      }

      return false;
    }
  )

  onContinue = () => {
    const result: string[] = Object.keys(this.state.selected).reduce((acc: string[], key) => {
      const item = this.state.selected[key];
      if (item) {
        acc.push(key);
      }
      return acc;
    }, []);

    if (this.props.onContinue) {
      this.props.onContinue(result);
    }
  }

  getFancyResultHeading = memoize(
    (selected: { [optionId: string]: boolean }, values: IOption[]): string => {
      return values.reduce((acc: string, value: IOption): string => {
        const isSelected = !!selected[value.id];
        if (isSelected) {
          return `${acc}\n${value.title}`;
        }
        return acc;
      }, '').trim();
    }
  );

  render() {
    const {
      searchValue,
      selected,
      values,
    } = this.state;

    const {
      enableSearch,
      multiselect,
      selectedState,
      placeholder,
    } = this.props;

    const canContinue = this.checkDone(selected);

    if (selectedState) {
      const fancyHeading = this.getFancyResultHeading(selected, values);

      return (
        <StyledSelectedContainer>
          <Button
            onClick={this.props.onCancel}
            color="selected"
            outlined
            style={{ whiteSpace: 'pre-wrap'}}
          >
            {fancyHeading}
          </Button>
        </StyledSelectedContainer>
      )
    }

    return (
      <StyledContainer>
        {enableSearch && (
          <StyledSearchInput
            value={searchValue}
            onChange={this.onSearchChange}
            placeholder={placeholder}
            onClearSearch={this.onClearSearch}
            autofocus
          />
        )}
        <OptionList
          selected={selected}
          values={values}
          onSelectItem={this.onSelectItem}
          searchValue={searchValue}
          multiselect={multiselect}
        />
        <RootPortal>
          <CSSTransition
            unmountOnExit={true}
            timeout={200}
            classNames="continue-button"
            in={canContinue}
          >
            <ContinueButton
              onClick={this.onContinue}
            >
              Continue
            </ContinueButton>
          </CSSTransition>
        </RootPortal>
      </StyledContainer>
    )
  }
}

const StyledSelectedContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 0 24px;
`;

const StyledContainer = styled.div`
  height: 100%;
  position: relative;
  /* display: flex;
  flex-d */

  .continue-button-enter {
    opacity: 0;
    transform: scale(0.9);
  }
  .continue-button-enter-active {
    opacity: 1;
    transform: translateX(0);
    transition: opacity 200ms, transform 200ms;
  }
  .continue-button-exit {
    opacity: 1;
  }
  .continue-button-exit-active {
    opacity: 0;
    transform: scale(0.9);
    transition: opacity 200ms, transform 200ms;
  }
`;

const StyledSearchInput = styled(SearchInput)`
  margin: 0 24px 24px 24px;
`;



function getSelectedObjectFromArray(intialSelects: string[]): { [optionId: string]: boolean } {
  const result: { [optionId: string]: boolean } = {};
  intialSelects.forEach((id: string) => {
    result[id] = true;
  })
  return result;
}

export default SelectList;
