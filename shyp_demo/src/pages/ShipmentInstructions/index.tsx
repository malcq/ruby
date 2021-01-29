import React, { PureComponent } from 'react';
import { Dispatch } from "redux";
import { connect } from "react-redux";
import Grid from '@material-ui/core/Grid';
import { CircularProgress } from "@material-ui/core";
import { get } from 'lodash';

import { promisifyAction } from '../../utils';
import { shipmentInstructionsGetData } from '../../stores/actionCreators';
import { Logger } from '../../utils/Logger';
import {
  ConsigneeCompanyForm,
  ConsigneeContactForm,
  ShipperCompanyForm,
  ShipperContactForm,
  NotifyPartyForm,
} from '../../components';

import './styles.scss';
import { isEditingAllowed, resourceKey } from '../../config/permissions';

const mapDispatchToProps = ( dispatch: Dispatch ) => ({
  getData: promisifyAction(dispatch, shipmentInstructionsGetData)
});

const mapStateToProps = (state: IGlobalState): any => ({
  data: state.shipmentInstructions.data,
  counter: state.shipmentLayout.layoutData.counters.instructions,
  permission: state.user.permission,
});

interface IShipmentInstructionsProps{
  data: any;
  match: IMatch | null;
  getData: IActionPromiseFactory;
  permission: string,
}

interface IShipmentInstructionsState{
  data: any;
  counter: number;
  isReadOnly: boolean;
  isExport: boolean;
  isCross: boolean;
  loading: boolean;
}

const initialState = {
  data: {},
  counter: 0,
  isReadOnly: false,
  isExport: false,
  isCross: false,
  loading: false
};

class ShipmentsInstructions extends PureComponent<IShipmentInstructionsProps, IShipmentInstructionsState> {
  public static propTypes = {};
  public static defaultProps = {};

  constructor (props, context) {
    super(props, context);
    this.state = initialState;
  }

  public async componentDidMount(){
    this.setState({ loading: true });

    try {
      const shipmentId = get(this.props.match, 'params.id', 0);
      await this.props.getData(shipmentId);
    } catch(error) {
      Logger.log(error)
    }

    this.setState({
      isReadOnly: !isEditingAllowed(resourceKey.shipmentInstructions, this.props.permission),
      isExport: this.props.data.trade_direction == 'export',
      isCross: this.props.data.trade_direction == 'cross_trade',
      loading: false
    });
  }

  public componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.data, counter: nextProps.counter });
  }

  public render () {
    const shipmentId = get(this.props.match, 'params.id', 0);
    const { isReadOnly, isExport, isCross, loading } = this.state;

    if (loading) {
      return (
        <article className="shipment-overview-page">
          <div style={{textAlign: 'center'}}>
            <CircularProgress size={50} style={{marginTop: '50px'}}/>
          </div>
        </article>
      )
    }

    return (
      <div className="shipping-instructions">
        {this._renderStatus()}
        <Grid container={true} spacing={24}>
          <Grid item={true} sm={12} md={12} lg={6}>
            {
              isExport
                ? <div>
                    <ShipperCompanyForm
                      shipmentId={shipmentId}
                      isReadOnly={isReadOnly}
                    />
                  </div>
                : <div>
                    <ShipperCompanyForm
                      shipmentId={shipmentId}
                      isReadOnly={isReadOnly}
                    />
                    <ShipperContactForm
                      shipmentId={shipmentId}
                      isReadOnly={isReadOnly}
                    />
                  </div>
            }
          </Grid>
          <Grid item={true} sm={12} md={12} lg={6}>
            {
              isExport || isCross
                ? <div>
                    <ConsigneeCompanyForm
                      shipmentId={shipmentId}
                      isReadOnly={isReadOnly}
                    />
                    <ConsigneeContactForm
                      shipmentId={shipmentId}
                      isReadOnly={isReadOnly}
                    />
                    <NotifyPartyForm
                      shipmentId={shipmentId}
                      isReadOnly={isReadOnly}
                    />
                  </div>
                : <div>
                    <ConsigneeCompanyForm
                      shipmentId={shipmentId}
                      isReadOnly={isReadOnly}
                    />
                  </div>
            }
          </Grid>
        </Grid>
      </div>
    );
  }

  public componentDidUpdate(prevProps: IShipmentInstructionsProps) {
    if (prevProps.permission !== this.props.permission) {
      this.setState({
        isReadOnly: !isEditingAllowed(resourceKey.shipmentInstructions, this.props.permission)
      });
    }
  }

  private _renderStatus() {
    if (this.state.data.contact_details_valid === undefined) { return null }
    const status = (this.state.data.contact_details_valid || !this.state.counter) ? 'valid' : 'invalid';
    return (
      <div className={`shipping-instructions__status ${status}`}>
        <div className="valid-content">
          <i className="icon checked"/> Information complete
        </div>
        <div className="invalid-content">
          <i className="icon attention"/> Information incomplete
        </div>
      </div>

  )
  }
}

export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(ShipmentsInstructions);
