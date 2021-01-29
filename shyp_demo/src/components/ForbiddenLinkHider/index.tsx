import React, { ReactNode, PureComponent } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';

import { isRouteAllowed, permissionStatus } from '../../config/permissions';

interface IProps{
  permission: string;
  path: string;
  placeholder?: ReactNode;
  children?: ReactNode;
}

interface IState{
  hidden: boolean;
}

const mapStateToProps = (state: IGlobalState) => ({
  permission: state.user.permission,
});

class ForbiddenLinkHider extends PureComponent<IProps, IState>{
  constructor(props, context) {
    super(props, context);

    this.state = {
      hidden: !isRouteAllowed(props.path, props.permission),
    };
  }

  public static defaultProps = {
    permission: permissionStatus.full,
    placeholder: null,
  };

  public componentDidUpdate(nextProps: IProps): void{
    if (
      nextProps.path !== this.props.path
      || nextProps.permission !== this.props.permission
    ) {
      this.setState({
        hidden: !isRouteAllowed(this.props.path, this.props.permission)
      })
    }
  }

  public render() {
    if(this.state.hidden) {
      return this.props.placeholder;
    }
    return this.props.children;
  }
};

export default connect<any, any, any>(mapStateToProps)(ForbiddenLinkHider);