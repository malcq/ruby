import React, { PureComponent, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Dispatch } from "redux";
import { connect } from "react-redux";
import moment from 'moment'
import { includes } from 'lodash';

import { promisifyAction } from '../../utils';
import { Logger } from '../../utils/Logger';
import { shipmentLinkGetData } from '../../stores/actionCreators';
import { Header, CustomGoogleMap, Shipment } from '../../components';
import { DATE_FORMAT } from '../../config/constants';
import './styles.scss';


interface IShipmentsLinkProps {
  match: IMatch | null;
  getData: IActionPromiseFactory;
}

interface IShipmentsLinkState {
  public_shipment: any;
  markers: any;
}

const initialState = {
  public_shipment: {},
  markers: [],
};

const mapDispatchToProps = ( dispatch: Dispatch ) => ({
  getData: promisifyAction(dispatch, shipmentLinkGetData),
});

const mapStateToProps = (state: IGlobalState): any => ({
  public_shipment: state.shipmentLink.public_shipment,
  markers: state.shipmentLink.markers,
});

const thresholds = {
  precarriage: 10,
  departure: 33,
  arrival: 66,
  delivery: 99,
};

const formatDate = (dateString) => (dateString)
  ? moment(dateString, DATE_FORMAT).format('DD MMM YYYY')
  : 'Not available';


class ShipmentsLink extends PureComponent<IShipmentsLinkProps, IShipmentsLinkState> {
  public static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        token: PropTypes.string,
      }).isRequired,
      url: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    }),
  };
  public static defaultProps = {};

  constructor (props, context) {
    super(props, context);
    this.state = initialState;
  }

  public async componentDidMount(): Promise<any>{
    try {
      await this.props.getData(this.props.match!.params.token);
    } catch(error) {
      Logger.log(error)
    }
  }

  public componentWillReceiveProps(nextProps) {
    this.setState({public_shipment: nextProps.public_shipment, markers: nextProps.markers});
  }

  public render () {
    const shipment = this.state.public_shipment;
    return (
      <div>
        <Header hideButtons />
        <div className="public-shipments">
          <div className="public-shipments__title">
            Track &amp; Trace for shipment {shipment.title}
          </div>
          <Shipment
            data={shipment}
            displayStatus={shipment.humanized_status}
            publicShipment
          />

          <div className="public-shipments__map">
            <CustomGoogleMap markers={this.state.markers}/>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShipmentsLink);
