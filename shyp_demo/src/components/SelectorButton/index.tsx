import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import bind from 'autobind-decorator';
import { toLower } from 'lodash';

import MenuButton, { IMenuOriginRender } from '../MenuButton';
import './styles.scss';

export { IMenuOriginProps } from '../MenuButton';

interface ISelectorButtonProps {
  value?: string,
  title?: string,
  options?: Array<string | number>[],
  buttonColor?: string,
  className?: string,
  renderOrigin?: IMenuOriginRender;
  onChange?: (optionId: string) => void,
  defaultValue?: string,
  isSearchable?: boolean,
  hasLimitedHeight?: boolean,
}

interface ISelectorButtonState {
  isOpen: boolean,
  search: string,
  lowerCaseSearch: string,
}

class SelectorButton extends PureComponent<ISelectorButtonProps, ISelectorButtonState> {
  public static propTypes = {
    value: PropTypes.string,
    title: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.arrayOf(
                                PropTypes.oneOfType([
                                  PropTypes.string.isRequired,
                                  PropTypes.number.isRequired
                                ])).isRequired),
    buttonColor: PropTypes.string,
    className: PropTypes.string,
    onCancel: PropTypes.func,
    onChange: PropTypes.func,
    defaultValue: PropTypes.string,
    isSearchable: PropTypes.bool,
  };

  public static defaultProps = {
    value: '',
    title: '',
    options: [],
    buttonColor: 'grey-outline-green',
    className: '',
    onChange: null,
    defaultValue: '',
    isSearchable: false,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      isOpen: false,
      search: '',
      lowerCaseSearch: '',
    }
  }


  public render () {
    const {
      buttonColor,
      className,
      value,
      renderOrigin,
      isSearchable,
      hasLimitedHeight,
    } = this.props;

    let options = this.props.options || [];

    if (this.state.search) {
      options = options.filter(this.matchSearch);
    }

    const isActive = this.props.value !== this.props.defaultValue;
    return (
      <MenuButton
        renderOrigin={renderOrigin}
        isOpen={this.state.isOpen}
        className={className}
        buttonColor={buttonColor}
        isActive={isActive}
        title={`${this.props.title} ${this.getOptionTitle()}`}
        onCancel={this.cancel}
        onOpen={this.open}
        onClose={this.close}
      >
        {isSearchable && (
          <div className="selector-button__search-container">
            <input
              className="selector-button__search"
              placeholder="Type to search"
              value={this.state.search}
              onChange={this.changeSearch}
            />
          </div>
        )}
        <div className={`selector-button__options ${hasLimitedHeight ? 'selector-button__options_limited': '' }`}>
          {options.map(([title, id]: string[]): any=>(
            <div
              className={`selector-button__option ${value === id ? 'selector-button__option_selected' : ''}`}
              key={id}
              onClick={this.pickOption.bind(this, id)}
            >
              <div className="selector-button__option-name">
                {title}
              </div>
            </div>
          ))}
        </div>
      </MenuButton>
    );
  }

  private getOptionTitle(){
    const option = (this.props.options || []).find(
      ([title, id]:string[]): boolean => id === this.props.value
    );
    return option ? option[0] : '';
  }

  private pickOption(option: string): void{
    if (this.props.onChange) {
      this.props.onChange(option)
    }
    this.close()
  }

  @bind
  private matchSearch(option: string[]): boolean {
    const { search } = this.state;
    return !search || toLower(option[0]).includes(this.state.lowerCaseSearch)
  }

  @bind
  private changeSearch(event: any): void {
    this.setState({
      search: event.currentTarget.value,
      lowerCaseSearch: toLower(event.currentTarget.value)
    });
  }

  @bind
  private cancel(): void{
    const { onChange, defaultValue } = this.props;
    if (onChange) {
      onChange(defaultValue || '')
    }
  }

  @bind
  private open(): void{
    this.setState({ isOpen: true, search: '' });
  }

  @bind
  private close(): void{
    this.setState({ isOpen: false });
  }
}

export default SelectorButton;
