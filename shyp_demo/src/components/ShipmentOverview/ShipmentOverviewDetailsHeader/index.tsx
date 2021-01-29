import React, { PureComponent, ReactNodeArray } from 'react';
import { connect } from "react-redux";
import { Dispatch } from "redux";
import PropTypes from 'prop-types';
import bind from "autobind-decorator";
import Tooltip from '@material-ui/core/Tooltip';
import { get } from 'lodash';

import { shipmentOverviewSubmitData, flashSuccess, flashError } from '../../../stores/actionCreators';
import { promisifyAction, withoutNullFields, Logger } from '../../../utils/';
import { ForbiddenEditHider } from '../../';

import './styles.scss'
import { resourceKey } from '../../../config/permissions';

interface IShipmentOverviewDetailsHeaderProps {
  shipment: IDetailedShipment;
  submit: IActionPromiseFactory;
  showError?: (message: string, duration?: number) => void;
  showSuccess?: (message: string, duration?: number) => void;
}

interface IShipmentOverviewDetailsHeaderState {
  [x: string]: any;
  reference_number: any;
  isShowTooltip: boolean;
}

const prepareForRequest = (state: IShipmentOverviewDetailsHeaderState): any => ({
  reference_number: state.reference_number,
});

const mapDispatchToProps = ( dispatch: Dispatch ): any => ({
  submit: promisifyAction(dispatch, shipmentOverviewSubmitData),
  showError(message: string, duration?: number): void {
    dispatch(flashError(message, duration))
  },
  showSuccess(message: string, duration?: number): void {
    dispatch(flashSuccess(message, duration))
  }
});

const mapStateToProps = (state: IGlobalState): any => ({
  shipment: state.shipmentOverview.shipmentOverviewData,
});

class ShipmentOverviewDetailsHeader extends PureComponent<IShipmentOverviewDetailsHeaderProps, IShipmentOverviewDetailsHeaderState> {
  public static propTypes = {
    shipment: PropTypes.object,
    submit: PropTypes.func,
    showSuccess: PropTypes.func,
    showError: PropTypes.func,
  };
  public static defaultProps = {
    shipment: {},
  };

  constructor(props){
    super(props);
    this.state = {
      reference_number: null,
      isShowTooltip: false,
    }
  }

  public render () {

    const { shipment } = this.props;

    return (
      <div className="shipment-details-header">
        <div className="shipment-details-header__column">
          <div className="shipment-details-header__title">
            Shipment ID
          </div>
          <div className="shipment-details-header__value">
            {shipment.title || '-'}
          </div>
        </div>
        <div className="shipment-details-header__column">
          <ForbiddenEditHider
            resource={resourceKey.shipmentUpdate}
            placeholder={[
              <div className="shipment-details-header__title" key="reference-input-title">
                Reference
              </div>,
              <div className="shipment-details-header__value" key="reference-input-value">
                {shipment.reference_number || '-'}
              </div>,
            ]}
          >
            {this.renderReferenceInput()}
          </ForbiddenEditHider>
        </div>
        <div className="shipment-details-header__column">
          <div className="shipment-details-header__title">
            Type
          </div>
          <div className="shipment-details-header__value">
            {shipment.type != null
              ? shipment.type === 'sea'
                ? [
                  <i
                    key="shipment-details-header__value-icon"
                    className="shipment-details-header__value-icon icon sea"
                  />,
                  'Ocean Freight',
                ]
                : [
                  <i
                    key="shipment-details-header__value-icon"
                    className="shipment-details-header__value-icon icon airport"
                  />,
                  'Air Freight',
                ]
              : '-'
            }
          </div>
        </div>
        <div className="shipment-details-header__column">
          <div className="shipment-details-header__title">
            Operator
          </div>
          <div className="shipment-details-header__value shipment-details-header__value--operator">
            {shipment.carrier_name != null && shipment.carrier_name !== ''
              ? shipment.carrier_name : '—'}
          </div>
        </div>
      </div>
    );
  }

  private renderReferenceInput(): ReactNodeArray{
    const { reference_number } = this.state;
    const { shipment } = this.props;

    return [
      <div className="shipment-details-header__title" key="reference-input-title">
        Reference
        {this.isEditReference() && [
          <i
            key="reference-input-cancel"
            className="shipment-details-header__icon shipment-details-header__icon--hover-red icon close"
            onClick={this.onClickCancelEditReference}
          />,
          reference_number != null && (
            <i
              key="reference-input-save"
              className="shipment-details-header__icon shipment-details-header__icon--hover-green icon check"
              onClick={this.onClickSaveReference}
            />
          )
        ]}
      </div>,
      <Tooltip
        key="reference-input"
        classes={{
          tooltip: 'shipment-details-header__value-tooltip mui-override'
        }}
        title={shipment.reference_number != null ? shipment.reference_number : ''}
        open={this.state.isShowTooltip}
        onOpen={this.onOpenTooltip}
        onClose={this.onCloseTooltip}
      >
        <input
          name="reference_number"
          value={reference_number == null ? shipment.reference_number || '' : reference_number}
          onChange={this.handleInputChange}
          className="shipment-details-header__input"
          type="text"
        />
      </Tooltip>
    ]
  }

  private isEditReference(): boolean{
    return this.state.reference_number != null;
  }

  @bind
  private onOpenTooltip(): void{
    const { shipment } = this.props;

    if (get(shipment.reference_number, 'length', 0) > 20 && !this.isEditReference()) {
      this.setState({
        isShowTooltip: true,
      })
    }
  }

  @bind
  private onCloseTooltip(): void{
    this.setState({
      isShowTooltip: false,
    })
  }

  @bind
  private onClickEditReference(): void{
    this.setState({
      reference_number: null
    });
  }

  @bind
  private onClickCancelEditReference(): void{
    this.setState({
      reference_number: null,
    });
  }

  @bind
  private async onClickSaveReference(): Promise<any>{
    const { shipment, showSuccess, showError } = this.props;
    const shipmentId = shipment.id != null ?  shipment.id : 0;

    try {
      await this.props.submit(shipmentId, withoutNullFields(prepareForRequest(this.state)));
      this.setState({
        reference_number: null
      });
      if(showSuccess){
        showSuccess(`Successfully set reference number. Shipment is updated`)
      }
    } catch(error) {
      Logger.log(error);
      if(showError){
        showError(`Failed to set reference number`);
      }
    }
  }

  @bind
  private handleInputChange(event: any): void{
    const {name, value} = event.currentTarget;
    const shipment: Pick<IDetailedShipment, keyof IDetailedShipment> = this.props.shipment;

    this.setState({
      [name]: shipment[name] === value ? null : value
    });
  }
}

export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(ShipmentOverviewDetailsHeader);
