import React, { PureComponent } from 'react';
import { connect } from "react-redux";
import { Dispatch } from "redux";
import PropTypes from 'prop-types';
import { CircularProgress } from "@material-ui/core";
import bind from "autobind-decorator";

import { Logger } from "../../utils/Logger";
import promisifyAction from "../../utils/promisifyAction";
import {
  shipmentOverviewGetData,
  shipmentOverviewSubmitData,
  shipmentOverviewUnpinMessage,
  flashError,
  flashSuccess
} from '../../stores/actionCreators';
import ShipmentOverviewDetailsHeader from "../../components/ShipmentOverview/ShipmentOverviewDetailsHeader";
import ShipmentOverviewPinnedMessages from "../../components/ShipmentOverview/ShipmentOverviewPinnedMessages";
import ShipmentOverviewTimeline from "../../components/ShipmentOverview/ShipmentOverviewTimeline";
import ShipmentOverviewTimelineDetails from "../../components/ShipmentOverview/ShipmentOverviewTimelineDetails";
import ShipmentOverviewContainer from "../../components/ShipmentOverview/ShipmentOverviewContainer";

import './styles.scss'
import { isEditingAllowed, resourceKey } from '../../config/permissions';

interface IShipmentsOverviewProps {
  match: IMatch | null;
  getData: IActionPromiseFactory;
  unpinMessage: any;
  submit: any;
  shipment: IDetailedShipment;
  history: any;
  showError: (message: string, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  permission: string,
}

interface IShipmentsOverviewState {
  loading: boolean;
  isReadOnly: boolean;
}

const mapDispatchToProps = ( dispatch: Dispatch ) => ({
  getData: promisifyAction(dispatch, shipmentOverviewGetData),
  unpinMessage: promisifyAction(dispatch, shipmentOverviewUnpinMessage),
  submit: promisifyAction(dispatch, shipmentOverviewSubmitData),
  showError(message: string, duration?: number): void {
    dispatch(flashError(message, duration))
  },
  showSuccess(message: string, duration?: number): void {
    dispatch(flashSuccess(message, duration))
  }
});

const serviceName = {
  barge_precarriage: 'pre carriage',
  barge_oncarriage: 'on carriage',
};

const mapStateToProps = (state: IGlobalState): any => ({
  shipment: state.shipmentOverview.shipmentOverviewData,
  permission: state.user.permission,
});

class ShipmentsOverview extends PureComponent<IShipmentsOverviewProps, IShipmentsOverviewState> {
  public static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
      url: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    }),
    shipment: PropTypes.any,
    showSuccess: PropTypes.func,
    showError: PropTypes.func,
  };
  public static defaultProps = {
    shipment: {},
  };

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      isReadOnly: false,
    }
  }

  public async componentDidMount(): Promise<any>{
    const match = this.props.match || { params: { id: 0 }};

    this.setState({ loading: true });
    try {
      await this.props.getData(match.params.id);
    } catch(error) {
      Logger.log(error)
    } finally {
      this.setState({ loading: false });
    }

    this.setState({
      isReadOnly: !isEditingAllowed(resourceKey.shipmentUpdate, this.props.permission),
    });
  }

  public render () {
    const { loading, isReadOnly } = this.state;
    const {
      shipment,
      showSuccess,
      showError,
      submit,
      history,
      unpinMessage,
    } = this.props;

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
      <article className="shipment-overview-page">
        <ShipmentOverviewDetailsHeader />
        <ShipmentOverviewPinnedMessages
          data={shipment}
          unpinMessage={unpinMessage}
        />
        <ShipmentOverviewTimeline
          isReadOnly={isReadOnly}
          type={shipment.type}
          progressPercent={shipment.progress_percent}
          status={shipment.status}
          timestamp={shipment.timestamp}
          estimatedDeparture={shipment.estimated_departure}
          estimatedArrival={shipment.estimated_arrival}
          preCarriageEnabled={shipment.pre_carriage_enabled}
          onCarriageEnabled={shipment.on_carriage_enabled}
          isBargeOnCarriage={shipment.barge_oncarriage}
          isBargePreCarriage={shipment.barge_precarriage}
          containerType={shipment.container_type}
          changeBargeCarriage={this.changeBargeCarriage}
        />
        <ShipmentOverviewTimelineDetails
          data={shipment}
          submit={submit}
          showError={showError}
          showSuccess={showSuccess}
        />
        <ShipmentOverviewContainer
          data={shipment}
          toLocation={history.push}
        />
      </article>
    );
  }

  public componentDidUpdate(prevProps: IShipmentsOverviewProps) {
    if (prevProps.permission !== this.props.permission) {
      this.setState({
        isReadOnly: !isEditingAllowed(resourceKey.shipmentUpdate, this.props.permission)
      });
    }
  }

  @bind
  private async changeBargeCarriage(fieldName: string, isBarge: boolean): Promise<any> {
    const match = this.props.match || { params: { id: NaN }};
    const { showSuccess, showError } = this.props;
    const transport = isBarge ? 'barge' : 'truck';

    try {
      await this.props.submit(
        Number(match.params.id),
        { [fieldName]: isBarge },
      );
      if(showSuccess){
        showSuccess(
          `Successfully set ${serviceName[fieldName]} as ${transport}. Shipment is updated`,
          5000 /* 5 sec */,
        )

      }
    } catch(error) {
      Logger.error(error);
      showError(`Failed to set ${serviceName[fieldName]} as ${transport}`)
    };
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShipmentsOverview);
