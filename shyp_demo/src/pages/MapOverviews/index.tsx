import React, { PureComponent } from 'react';
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { promisifyAction } from '../../utils';
import { mapOverviewsGetData } from '../../stores/actionCreators';
import { CustomGoogleMap } from "../../components"
import './styles.scss';
import { Logger } from '../../utils/Logger';


interface IMapOverviewsProps {
  getData: IActionPromiseFactory;
}

interface IMapOverviewsState {
  list: any;
}

const mapDispatchToProps = ( dispatch: Dispatch ) => ({
  getData: promisifyAction(dispatch, mapOverviewsGetData),
});

const mapStateToProps = (state: IGlobalState): any => ({
  list: state.mapOverviews.list,
});

const initialState = {
  list: [],
};

class MapOverviews extends PureComponent<IMapOverviewsProps, IMapOverviewsState> {

  constructor (props, context) {
    super(props, context);
    this.state = initialState;
  }

  public async componentDidMount(): Promise<any>{
    try {
      await this.props.getData();
    } catch(error) {
      Logger.log(error)
    }
  }

  public componentWillReceiveProps(nextProps) {
    this.setState({list: nextProps.list});
  }

  public render() {
    return (
      <div className="map-overview">
        <h3 className="map-overview__header">Map Overview</h3>
        <CustomGoogleMap markers={this.state.list} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapOverviews);
