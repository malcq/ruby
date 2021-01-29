import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import bind from 'autobind-decorator';
import { includes, cloneDeep, get, last } from 'lodash';
import { AutoSizer, List, CellMeasurer, CellMeasurerCache } from 'react-virtualized';

import { Logger } from '../../../utils/Logger';
import { MenuButton, Checkbox } from '../../../components';

import './styles.scss';

interface IProps {
  fieldName?: string,
  hsCodes?: IHSOption[];
  className?: string;
  buttonColor?: string;
  title?: string;
  onPickOption?: (option: string, fieldName?: string) => void;
  hsCodesGetData: IActionPromiseFactory;
  relevantHsCodesGetData: IActionPromiseFactory;
  containerHsCodesSubmitData: IActionPromiseFactory;
  clearHsCodesData: any,
  containerId: number;
  hsCodesValues?: number[];
  disabled: boolean;
}

interface IState {
  search: string,
  isLoading: boolean,
  hsCodes: IHSOption[]
}

interface IHSOption{
  id: number,
  type: string,
  text: string,
}

class ShipmentDocsHSCodesMultiSelectorButton extends PureComponent<IProps, IState> {
  public static propTypes = {
    fieldName: PropTypes.string,
    hsCodes: PropTypes.array,
    className: PropTypes.string,
    buttonColor: PropTypes.string,
    onPickOption: PropTypes.func,
    containerId: PropTypes.number,
    hsCodesValues: PropTypes.array,
  };

  public static defaultProps = {
    fieldName: '',
    hsCodes: [],
    className: '',
    buttonColor: 'grey-outline-green',
    onPickOption: null,
    containerId: 0,
    hsCodesValues: [],
    disabled: false,
  };

  public componentDidMount(){
    this.setState({
      hsCodes: this.filterHsCodes()
    })
  }


  private listCache;

  private inputTimeout;

  constructor(props, context) {
    super(props, context);
    this.listCache = new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 100,
    });
    this.inputTimeout = null;
    this.state = {
      search: '',
      isLoading: false,
      hsCodes: [],
    }
  }

  public render () {
    const {
      buttonColor,
      className,
      hsCodesValues,
      disabled,
    } = this.props;
    const count = get(hsCodesValues, 'length', 0);
    const isActive = count > 0;

    return (
      <MenuButton
        className={className}
        menuClassName="shipment-docs-hs-codes-multi-selector-button__menu-button"
        buttonColor={disabled ? 'grey-outline-disabled' : buttonColor }
        buttonColorActive={disabled ? 'grey-outline-disabled' : 'green'}
        isActive={isActive && !disabled}
        title={`${this.props.title} ${isActive ? `(${count})` : ''}`}
        onClick={this.onClick}
        onCancel={this.cancel}
        onClose={this.close}
      >
        <div className="shipment-docs-hs-codes-multi-selector-button__main-container">
          <div className="shipment-docs-hs-codes-multi-selector-button__search-container">
            <input
              className="shipment-docs-hs-codes-multi-selector-button__search"
              placeholder="Type to search"
              value={this.state.search}
              onChange={this.changeSearch}
            />
          </div>
          {this.renderContent()}
        </div>
      </MenuButton>
    );
  }

  public componentDidUpdate(prevProps: IProps): void {
    if (
      prevProps.hsCodes !== this.props.hsCodes
      || prevProps.disabled !== this.props.disabled
    ) {
      this.setState({
        hsCodes: this.filterHsCodes()
      })
    }
  }

  private renderContent(){
    if (this.state.isLoading) {
      return (
        <div className="shipment-docs-hs-codes-multi-selector-button__info-block">
          Searching...
        </div>
      )
    }

    const count = get(this.state.hsCodes, 'length', 0);
    if (count > 0) {
      return (
        <AutoSizer disableHeight={true}>
          {({ width }) => (
            <List
              className="shipment-docs-hs-codes-multi-selector-button__hs-codes-list"
              width={width}
              height={200}
              deferredMeasurementCache={this.listCache}
              rowHeight={this.listCache.rowHeight}
              rowRenderer={this.renderRow}
              rowCount={count}
              overscanRowCount={10}
              sortBy={()=>{}}
            />
          )}
        </AutoSizer>
      )
    }

    return (
      <div className="shipment-docs-hs-codes-multi-selector-button__info-block">
        No results found
      </div>
    );
  }

  private filterHsCodes(): IHSOption[] {
    const { hsCodes = [], disabled } = this.props;
    return disabled
      ? hsCodes.filter(this.isOptionPicked).filter(this.isGroupNotEmpty)
      : hsCodes;
  }

  @bind
  private isOptionPicked({ id, type }: IHSOption): boolean {
    return type === 'parent' || includes(this.props.hsCodesValues, id)
  }

  @bind
  private isGroupNotEmpty(option: IHSOption, i: number, hsCodes: IHSOption[]): boolean{
    const next = hsCodes[i+1];
    return (option.type !== 'parent') || (next && next.type !== 'parent')
  }

  @bind
  private renderRow(rowProps: any) {
    const { index, key, parent } = rowProps;

    return (
      <CellMeasurer
        key={key}
        cache={this.listCache}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
      >
        {this.renderRowContent(rowProps)}
      </CellMeasurer>
    )
  }

  private renderRowContent({ index, style }: any) {
    const { hsCodesValues, disabled } = this.props;
    const { hsCodes } = this.state;

    if (hsCodes[index] == null) {
      return <div style={style} />
    }

    if (hsCodes[index].type === 'parent') {
      return (
        <div
          style={style}
          className="shipment-docs-hs-codes-multi-selector-button__option"
        >
          <div className="shipment-docs-hs-codes-multi-selector-button__option-parent-name">
            {hsCodes[index].text}
          </div>
        </div>
      )
    }

    const isChecked = includes(hsCodesValues, hsCodes[index].id);

    const disabledModifier = disabled
      ? 'shipment-docs-hs-codes-multi-selector-button__option-children_disabled'
      : '';

    return (
      <div
        style={style}
        className="shipment-docs-hs-codes-multi-selector-button__option"
      >
        <div
          className={`
            shipment-docs-hs-codes-multi-selector-button__option-children
            ${disabledModifier}
          `}
          key={hsCodes[index].id}
          onClick={this.pickOption.bind(this, hsCodes[index].id)}
        >
          {!disabled && (
            <Checkbox
              className="shipment-docs-hs-codes-multi-selector-button__option-children-checkbox"
              checked={isChecked}
              color="green"
            />
          )}
          <div className="shipment-docs-hs-codes-multi-selector-button__option-children-name">
            {hsCodes[index].text}
          </div>
        </div>
      </div>
    )
  }

  private async pickOption(option: number): Promise<any> {
    const { hsCodesValues, disabled } = this.props;
    if (disabled) { return; }
    let hsCodesValuesUpdated = cloneDeep(hsCodesValues);

    if (hsCodesValues != null) {
      if (!hsCodesValues.find(hsCode => hsCode === option)) {
        hsCodesValuesUpdated.push(option)
      } else {
        hsCodesValuesUpdated = hsCodesValuesUpdated.filter(hsCode => hsCode !== option)
      }

      try {
        await this.props.containerHsCodesSubmitData(this.props.containerId, {
          hs_codes: hsCodesValuesUpdated,
        });
      } catch(error) {
        Logger.error(error)
      }
    }
  }

  @bind
  private changeSearch(event: any): void {
    const value = event.currentTarget.value;

    this.setState({ search: value });

    clearTimeout(this.inputTimeout);

    this.inputTimeout = setTimeout(async (): Promise<any> => {
      if (this.listCache != null) {
        this.listCache.clearAll();
      }

      try {
        if (value !== '') {
          this.setState({
            isLoading: true,
          });
          await this.props.hsCodesGetData({ q: value.trim() });
        } else {
          this.setState({
            isLoading: true,
          });
          await this.props.relevantHsCodesGetData(this.props.containerId);
        }
      } catch(error) {
        Logger.error(error)
      } finally {
        this.setState({
          isLoading: false,
        });
      }
    }, 500);
  }

  @bind
  private async cancel(): Promise<any>{
    if (this.listCache != null) {
      this.listCache.clearAll();
    }

    if(this.props.disabled){ return; }

    try {
      await this.props.containerHsCodesSubmitData(this.props.containerId, { hs_codes: [] });}
    catch(error) {
      Logger.error(error)
    }
  }

  @bind
  private async onClick(): Promise<any>{
    if (this.listCache != null) {
      this.listCache.clearAll();
    }

    this.setState({ search: '' });

    try {
      this.setState({
        isLoading: true,
      });
      await this.props.relevantHsCodesGetData(this.props.containerId);
    } catch(error) {
      Logger.error(error)
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  }

  @bind
  private close(): void{
   this.props.clearHsCodesData();
  }
}

export default ShipmentDocsHSCodesMultiSelectorButton;
