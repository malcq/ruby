import * as React from 'react';
import { DashboardBooking, DashboardPreBooked, DashboardDelivered, DashboardInTransit } from "../../components"
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { promisifyAction } from '../../utils';
import { fetchDashboardData } from '../../stores/actionCreators';
import { CircularProgress } from '@material-ui/core';
import './styles.scss'

const mapDispatchToProps = ( dispatch: Dispatch ) => ({
  getData: promisifyAction(dispatch, fetchDashboardData)
});

interface IAccountProps{
  getData: IActionPromiseFactory
}

interface IAccountState{
  loading: boolean;
}
class Dashboard extends React.Component<IAccountProps, IAccountState> {
  constructor(props){
    super(props);
    this.state={loading: false}
  }
  public async componentDidMount(){
    this.setState({ loading: true });
    try{
      await this.props.getData();
    } finally {
      this.setState({ loading: false });
    }
  }
  public render() {
    return (
      <div>
        {this.state.loading && (
          <div style={{textAlign: 'center'}}>
            <CircularProgress size={50} style={{marginTop: '50px'}}/>
          </div>
        )}
        {!this.state.loading && (
          <div>
            <div className="dashboard-container">
              <div className="dashboard-container__booking">
                <DashboardBooking/>
                <DashboardPreBooked/>
              </div>
              <div className="dashboard-container__shipments">
                <DashboardInTransit/>
                <DashboardDelivered/>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(Dashboard);