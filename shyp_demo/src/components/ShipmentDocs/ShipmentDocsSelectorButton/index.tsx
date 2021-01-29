import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import bind from 'autobind-decorator';
import { includes, find } from 'lodash';

import { MenuButton } from '../../../components';

import './styles.scss';
import { Logger } from '../../../utils/Logger';

interface IOption {
  id: string | number,
  title: any,
}

interface IShipmentDocsSelectorButtonProps {
  value?: string | number,
  fallbackValue?: string | number,
  title?: string,
  fieldName?: string,
  options?: IOption[];
  className?: string;
  buttonColor?: string;
  onClickOption?: (option: string | number, fieldName?: string) => void;
}

interface IShipmentDocsSelectorButtonState {
  search: string,
  isOpen: boolean,
}

class ShipmentDocsSelectorButton extends PureComponent<IShipmentDocsSelectorButtonProps, IShipmentDocsSelectorButtonState> {
  public static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    title: PropTypes.string,
    fieldName: PropTypes.string,
    options: PropTypes.array,
    className: PropTypes.string,
    buttonColor: PropTypes.string,
    onClickOption: PropTypes.func,
  };

  public static defaultProps = {
    value: '',
    title: '',
    fieldName: '',
    options: [],
    className: '',
    buttonColor: 'grey-outline-green',
    onClickOption: null,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      search: '',
      isOpen: false,
    }
  }

  public render () {
    const {
      buttonColor,
      className,
      value,
      fallbackValue,
    } = this.props;
    const options = (this.props.options || []).filter(this.matchSearch);
    const selectedValue = (this.props.options || []).find(item => item.id === this.props.value);
    let title = this.props.title;

    if (selectedValue) {
      title = selectedValue.title != null && selectedValue.title !== '' ? selectedValue.title : selectedValue.id;
    }

    return (
      <MenuButton
        className={className}
        buttonColor={buttonColor}
        isActive={fallbackValue != null && value !== fallbackValue}
        title={title}
        isOpen={this.state.isOpen}
        onOpen={this.open}
        onClose={this.close}
        onCancel={this.cancel}
      >
        <div>
          <div className="shipment-docs-selector-button__search-container">
            <input
              className="shipment-docs-selector-button__search"
              placeholder="Type to search"
              value={this.state.search}
              onChange={this.changeSearch}
            />
          </div>
          {options != null && options.length > 0 ? (
            <div className="shipment-docs-selector-button__options">
              {options.map(item => (
                <div
                  className="shipment-docs-selector-button__option"
                  key={item.id}
                  onClick={this.pickOption.bind(this, item.id)}
                >
                  <div className="shipment-docs-selector-button__option-name">
                    {item.title != null && item.title !== '' ? item.title : item.id}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="shipment-docs-selector-button__no-results">
              No results found
            </div>)
          }
        </div>
      </MenuButton>
    );
  }

  private pickOption(optionId: string): void{
    if (this.props.onClickOption) {
      this.props.onClickOption(optionId);
    }
    this.close();
  }

  @bind
  private matchSearch(option): boolean {
    return !this.state.search || (option.title != null && option.title !== '' ?
      option.title.toString().toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1 :
      option.id.toString().toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1);
  }

  @bind
  private changeSearch(event: any): void {
    this.setState({ search: event.currentTarget.value });
  }

  @bind
  private open(): void{
    this.setState({ isOpen: true });
  }

  @bind
  private close(): void{
    this.setState({ isOpen: false });
  }

  @bind
  private cancel(): void{
    const { onClickOption, fallbackValue } = this.props;

    if(onClickOption && fallbackValue != null){
      onClickOption(fallbackValue);
    }
  }
}

export default ShipmentDocsSelectorButton;
