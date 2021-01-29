import React, { ReactNode, PureComponent } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { isEditingAllowed, permissionStatus } from '../../config/permissions';

interface IProps{
  permission: string;
  resource: string;
  placeholder?: ReactNode;
  children?: ReactNode;
}

interface IState{
  hidden: boolean;
}

const mapStateToProps = (state: IGlobalState) => ({
  permission: state.user.permission,
});

class ForbiddenEditHider extends PureComponent<IProps, IState>{
  public static defaultProps = {
    permission: permissionStatus.full,
    placeholder: null,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      hidden: !isEditingAllowed(props.resource, props.permission),
    };
  }

  public componentDidUpdate(nextProps: IProps): void{
    if (
      nextProps.resource !== this.props.resource
      || nextProps.permission !== this.props.permission
    ) {
      this.setState({
        hidden: !isEditingAllowed(this.props.resource, this.props.permission)
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

export default connect<any, any, any>(mapStateToProps)(ForbiddenEditHider);
