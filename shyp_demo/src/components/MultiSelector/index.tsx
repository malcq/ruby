import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import bind from 'autobind-decorator';
import { includes } from 'lodash';

import { MenuButton, Checkbox } from '../../components';
import './styles.scss';

interface IMultiSelectorProps {
  fieldName?: string,
  options?: Array<Array<string | number>>;
  pickedOptionIds?: string[];
  className?: string;
  placement?: string;
  buttonColor?: string;
  title?: string;
  onPickOption?: (option: string, fieldName?: string) => void;
  onCancel?: (fieldName: string) => void;
  onClose?: () => void;
}

interface IMultiSelectorState {
  search: string,
}

class MultiSelector extends PureComponent<IMultiSelectorProps, IMultiSelectorState> {
  public static propTypes = {
    fieldName: PropTypes.string,
    options: PropTypes.arrayOf( PropTypes.arrayOf(
                                  PropTypes.oneOfType([
                                    PropTypes.string.isRequired,
                                    PropTypes.number.isRequired
                                  ])
                                ).isRequired),
    pickedOptionIds: PropTypes.arrayOf(PropTypes.string.isRequired),
    className: PropTypes.string,
    buttonColor: PropTypes.string,
    onPickOption: PropTypes.func,
    onCancel: PropTypes.func,
  };

  public static defaultProps = {
    fieldName: '',
    options: [],
    pickedOptionIds: [],
    className: '',
    buttonColor: 'grey-outline-green',
    onPickOption: null,
    onCancel: null,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      search: '',
    }
  }

  public render () {
    const {
      buttonColor,
      className,
    } = this.props;
    const options = (this.props.options || []).filter(this.matchSearch);
    const pickedOptionIds = this.props.pickedOptionIds || [];
    const isActive = pickedOptionIds.length > 0;
    return (
      <MenuButton
        className={className}
        buttonColor={buttonColor}
        isActive={isActive}
        title={`${this.props.title} ${isActive ? `(${pickedOptionIds.length})` :''}`}
        placement={this.props.placement}
        onCancel={this.cancel}
        onClose={this.close}
      >
        <div>
          <div className="multi-selector__search-container">
            <input
              className="multi-selector__search"
              placeholder="Type to search"
              value={this.state.search}
              onChange={this.changeSearch}
            />
          </div>
          <div className="multi-selector__options">
            {options.map(([title, id]: string[]): any=>(
              <div
                className="multi-selector__option"
                key={id}
                onClick={this.pickOption.bind(this, id)}
              >
                <Checkbox
                  className="multi-selector__option-checkbox"
                  checked={includes(pickedOptionIds, id)}
                  color="green"
                />
                <div className="multi-selector__option-name">
                  {title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </MenuButton>
    );
  }

  private pickOption(option: string): void{
    if (this.props.onPickOption) {
      this.props.onPickOption(option, this.props.fieldName)
    }
  }

  @bind
  private matchSearch(option: string[]): boolean {
    return !this.state.search || option[0].includes(this.state.search)
  }

  @bind
  private changeSearch(event: any): void {
    this.setState({ search: event.currentTarget.value });
  }

  @bind
  private cancel(): void{
    const { fieldName, onCancel } = this.props;
    if (onCancel && fieldName) {
      onCancel(fieldName);
    }
  }

  @bind
  private close(): void{
    if (this.props.onClose) {
      this.props.onClose();
    }
  }
}

export default MultiSelector;
