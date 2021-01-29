import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tab as MuiTab } from '@material-ui/core';
import { TabProps } from '@material-ui/core/Tab';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { LocationDescriptor } from 'history';
import { get } from 'lodash';
import { push } from 'react-router-redux';
import bind from 'autobind-decorator';
import joinURL from 'url-join';

import { isRouteAllowed, permissionStatus } from '../../config/permissions';
import { Logger } from '../../utils/Logger';


interface IProps extends TabProps{
  basePath: string;
  toLocation(LocationDescriptor): void;
  queryString: string;
}



const mapStateToProps = (state: IGlobalState) => ({
  queryString: get(state.routing, 'location.search', ''),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  toLocation(location: LocationDescriptor){ dispatch(push(location)) },
});

class Tab extends PureComponent<IProps> {
  public render() {
    const {
      basePath,
      toLocation,
      queryString,
      ...tabProps
    } = this.props;
    return (
      <MuiTab
        {...tabProps as any}
        onChange={this.switchTab}
      />
    );
  }

  @bind
  private switchTab():void {
    const { toLocation, queryString, value, basePath } = this.props;
    if (toLocation) {
      toLocation({
        pathname: joinURL(basePath, value),
        search: queryString,
      });
    }
  }
}

export default connect<any, any, any>(
  mapStateToProps,
  mapDispatchToProps,
)(Tab);
