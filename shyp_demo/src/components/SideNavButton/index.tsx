import React, { PureComponent, ReactNode } from 'react';
import { startsWith, get } from 'lodash';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { parse } from 'query-string';

import bind from 'autobind-decorator';

import { Logger } from '../../utils';
import { Tooltip } from '../';
import { SMALL_SCREEN_WIDTH, MOBILE_SCREEN_WIDTH } from '../../config/constants';
import './styles.scss';

interface ISideNavButtonProps {
  className?: string;
  to?: string;
  from?: string;
  currentPath?: string;
  icon?: string;
  additionalContent?: ReactNode;
  title?: string;
}

interface ISideNavButtonState {
  isTooltipOpen: boolean;
}

const mapStateToProps = (state: IGlobalState) => ({
  from: parse(get(state.routing, 'location.search')).from,
  currentPath: get(state.routing, 'location.pathname')
});

const initialState = { isTooltipOpen: false };

class SideNavButton extends PureComponent<ISideNavButtonProps, ISideNavButtonState> {
  public state = initialState;

  public static defaultProps = {
    className: '',
    children: '',
    to: '',
    from: '',
    icon: 'none',
    additionalContent: '',
    title: '',
  };

  public render () {
    const {
      className,
      title,
      additionalContent,
      to,
      from,
      icon,
    } = this.props;
    const activeClassName = this.checkIfActive() ? 'sidenav-button_active' : '';
    return (
      <Tooltip
        onClose={this.closeTooltip}
        onOpen={this.openTooltip}
        open={this.state.isTooltipOpen}
        placement="right"
        title={title}
        classes={{
          tooltip: 'sidenav-button__tooltip'
        }}
      >
        <Link
          className={`sidenav-button ${className} ${activeClassName}`}
          to={to}
        >
          <span className="sidenav-button__icon">
            <i className={`${icon} icon`}/>
          </span>
          <span className="sidenav-button__name">
            {title}{additionalContent}
          </span>
        </Link>
      </Tooltip>
    );
  }

  private checkIfActive(): boolean{
    const { currentPath, to, from } = this.props;
    return startsWith(from || `${currentPath}/`, to)
  }

  @bind
  private openTooltip(): void{
    if(window.innerWidth < SMALL_SCREEN_WIDTH && window.innerWidth > MOBILE_SCREEN_WIDTH){
      this.setState({ isTooltipOpen: true })
    }
  }

  @bind
  private closeTooltip(): void{
    this.setState({ isTooltipOpen: false })
  }

}

export default connect<any,any,any>(mapStateToProps)(SideNavButton);
