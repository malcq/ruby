import bind from 'autobind-decorator'
import React, { PureComponent } from 'react';
import DashboardRow from '../DashboardRow';
import { connect } from 'react-redux'
import { Paper } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Dispatch } from "redux";
import { promisifyAction } from '../../utils';
import {fetchDashboardDataPrebooked} from "../../stores/actionCreators/dashboard";
import { CircularProgress } from '@material-ui/core';

const mapStateToProps = (state: IGlobalState): any => ({
  count: state.dashboard.not_confirmed_bookings_count,
  shipments: state.dashboard.not_confirmed_bookings.shipments,
  loading: state.dashboard.not_confirmed_bookings.loading,
});

const mapDispatchToProps = ( dispatch: Dispatch ) => ({
  getData: promisifyAction(dispatch, fetchDashboardDataPrebooked)
});

class DashboardDelivered extends PureComponent<any, any> {
  public static propTypes = {
    count: PropTypes.number,
    shipments: PropTypes.array,
  };
  public static defaultProps = {
    count: 0,
    shipments: [],
  };
  constructor(props) {
    super(props)
    this.state = {full: false, expanded: true}
  }
  public render () {
    return (
      <Paper
        elevation={1}
        classes={{root:'dashboard-layout dashboard__prebooked'}}
      >
        <div className="dashboard-layout__title icon calendar">
          Pre-booked shipments
        </div>
        <div className="dashboard-layout__border">
          { this.props.shipments && this.props.shipments.slice(0, !this.state.expanded ? 5 : this.props.shipments.length).map(shipment => (<DashboardRow
            shipName={shipment.title}
            shipNumber={shipment.reference_number}
            dateFrom={shipment.estimated_departure}
            locationFrom={`${shipment.loading_port}, ${shipment.loading_port_country}`}
            dateTo={shipment.current_estimated_arrival}
            locationTo={`${shipment.discharge_port}, ${shipment.discharge_port_country}`}
            progress={shipment.progress_percent}
            delayed_days={shipment.delayed_days}
            shipment_type={shipment.shipment_type}
            sliderColor={['grey','grey']}
            full={true}
            key={shipment.title}
            id={shipment.id}
            valid_information={shipment.valid_information}
          />))}
        </div>
        { !this.props.loading && !this.state.full && this.props.count > 5 && (
          <div className="dashboard-layout__load-more" onClick={this.loadMore}>
            Show all {this.props.count} pre-booked shipments
          </div>
        )}
        { !this.props.loading && this.state.full && this.props.count > 5 && this.state.expanded && (
          <div className="dashboard-layout__load-more" onClick={this.expand}>
            Show first 5 pre-booked shipments
          </div>
        )}
        { !this.props.loading && this.state.full && this.props.count > 5 && !this.state.expanded && (
          <div className="dashboard-layout__load-more" onClick={this.expand}>
            Show all {this.props.count} pre-booked shipments
          </div>
        )}
        { this.props.loading && (
          <div style={{textAlign: 'center'}}>
            <CircularProgress size={30} style={{marginTop: '10px'}}/>
          </div>
        )}
      </Paper>
    );
  }
  @bind
  private async loadMore(): Promise<any>{
    try {
      await this.props.getData();
    } finally {
      this.setState({full: true})
    }
  }
  @bind
  private expand() {
    this.setState(state=>({expanded: !state.expanded}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardDelivered);
