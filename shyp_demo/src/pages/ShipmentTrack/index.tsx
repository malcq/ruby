import React, { PureComponent } from 'react';
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { promisifyAction } from '../../utils';
import { Logger } from '../../utils/Logger';
import { CustomGoogleMap } from "../../components"
import { shipmentTrackGetData } from '../../stores/actionCreators';

interface IShipmentsTrackProps {
  match: IMatch | null;
  getData: IActionPromiseFactory;
}

interface IShipmentsTrackState {
  list: any;
}

const initialState = {
  list: [],
};

const mapDispatchToProps = ( dispatch: Dispatch ) => ({
  getData: promisifyAction(dispatch, shipmentTrackGetData),
});

const mapStateToProps = (state: IGlobalState): any => ({
  list: state.shipmentTrack.list,
});

class ShipmentsTrack extends PureComponent<IShipmentsTrackProps, IShipmentsTrackState> {

  constructor (props, context) {
    super(props, context);
    this.state = initialState;
  }

  public async componentDidMount(): Promise<any>{
    try {
      await await this.props.getData(this.props.match!.params.id);
    } catch(error) {
      Logger.log(error)
    }
  }

  public componentWillReceiveProps(nextProps) {
    this.setState({list: nextProps.list});
  }

  public static defaultProps = {};

  public render () {
    return (
      <div>
        <CustomGoogleMap markers={this.state.list}/>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShipmentsTrack);
