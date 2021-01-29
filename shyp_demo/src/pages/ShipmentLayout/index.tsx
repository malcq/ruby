import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router';
import { Tabs } from '@material-ui/core';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Location, LocationDescriptor } from 'history';
import { Dispatch } from 'redux';
import bind from 'autobind-decorator';
import { ActionCable } from 'react-actioncable-provider';
import { parse } from 'query-string';
import { isEqual, get, includes, values } from 'lodash';
import joinUrl from 'url-join';

import { selfURL } from '../../config/local.json';
import { promisifyAction, Logger } from '../../utils';
import {
  shipmentLayoutGetData,
  shipmentLayoutDeleteShipment,
  shipmentLayoutAcceptQuote,
  flashSuccess,
  flashError,
  flagsNotFound,
} from '../../stores/actionCreators';
import {
  Paper,
  Button,
  IconedButton,
  ConfirmDialog,
  ForbiddenEditHider,
  Tab,
} from '../../components/';
import routeToTabName from './routeToTabName';
import * as tabRoutes from './tabRoutes';
import {
  ShipmentOverview,
  ShipmentInstructions,
  ShipmentDocs,
  ShipmentTrack,
  ShipmentPrice,
  ShipmentChat,
} from '../'
import { cancellableStatuses } from './statusGroups';
import './styles.scss';
import { isRouteAllowed, permissionStatus, resourceKey } from '../../config/permissions';

interface IShipmentLayoutProps {
  match?: IMatch | null;
  location: Location;
  counters: any;
  shipmentToken: string;
  shipmentTitle: string;
  shipmentStatus: string;
  queryString: string;
  toLocation: (location: LocationDescriptor) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  raiseNotFoundFlag: () => void;
  getData: IActionPromiseFactory;
  deleteShipment: IActionPromiseFactory;
  acceptQuote: IActionPromiseFactory;
  permission: string,
}

interface IShipmentLayoutState {
  counters: Partial<IShipmentLayoutCounters>;
  dialogIsOpen: boolean;
}

interface ITabProps {
  label: string;
  value: string;
  badgeFieldName?: string;
}

interface ITabPermissionsMap {
  [x: string]: ITabProps[];
}

const tabClasses = {
  root: 'shipment-layout__tab mui-override',
  labelContainer: 'shipment-layout__tab-text mui-override',
  wrapper: 'shipment-layout__tab-text-wrapper mui-override',
  selected: 'shipment-layout__tab_selected mui-override',
  label: 'shipment-layout__tab-label mui-override',
};

const matchDummy = {
  params: {
    id: 'none',
  },
  url: '',
};

const tabMap: ITabPermissionsMap = {
  [permissionStatus.full]: [
    { label: 'Overview', value: tabRoutes.overview },
    {
      label: 'Shipping Instructions',
      value: tabRoutes.instructions,
      badgeFieldName: 'intructions',
    },
    {
      label: 'Documents',
      value: tabRoutes.documentation,
      badgeFieldName: 'documents',
    },
    { label: 'Track', value: tabRoutes.track },
    { label: 'Costs', value: tabRoutes.costs },
    {
      label: 'Conversation',
      value: tabRoutes.conversations,
      badgeFieldName: 'conversation',
    },
  ]
};

// creating list of tabs for user groups based on their allowed routes
values(permissionStatus).forEach((permissionType: string): void => {
  if (permissionType !== permissionStatus.full) {
    tabMap[permissionType] = tabMap[permissionStatus.full]
      .filter(({ value }: ITabProps) : boolean =>
        isRouteAllowed(joinUrl('/shipments/0/',value), permissionType))
  }
});

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  toLocation(location: LocationDescriptor): void { dispatch(push(location)); },
  getData: promisifyAction(dispatch, shipmentLayoutGetData),
  showSuccess(message: string): void { dispatch(flashSuccess(message)); },
  showError(message: string): void { dispatch(flashError(message)); },
  raiseNotFoundFlag(): void { dispatch(flagsNotFound(true)); },
  deleteShipment: promisifyAction(dispatch, shipmentLayoutDeleteShipment),
  acceptQuote: promisifyAction(dispatch, shipmentLayoutAcceptQuote)
});

const mapStateToProps = (state: IGlobalState): any => ({
  counters: state.shipmentLayout.layoutData.counters,
  shipmentToken: state.shipmentLayout.layoutData.token,
  shipmentTitle: state.shipmentLayout.layoutData.shipment_title,
  shipmentStatus: state.shipmentLayout.layoutData.status,
  queryString: get(state.routing, 'location.search', ''),
  permission: state.user.permission,
});

const initialState = {
  counters: {
    documents: 0,
    instructions: 0,
  },
  dialogIsOpen: false,
};


class ShipmentLayout extends PureComponent<IShipmentLayoutProps, IShipmentLayoutState> {

  public static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
      url: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    }),
    toLocation: PropTypes.func.isRequired,
    location: PropTypes.any.isRequired,
    permission: PropTypes.string.isRequired,
  };

  public static defaultProps = {};

  public actionCableRef: any;

  constructor (props, context) {
    super(props, context);
    this.state = initialState;
  }

  public async componentDidMount(): Promise<any>{
    try {
      await this.props.getData(this.props.match!.params.id);
    } catch(error) {
      const statusCode = get(error, 'response.status');
      if (statusCode === 404 && this.props.raiseNotFoundFlag) {
        this.props.toLocation('/dashboard')
      }
      Logger.error(error);
    }
    if (this.actionCableRef) {
      this.actionCableRef.perform('get_shipment_comments_count', {shipment_id: this.props.match!.params.id});
    }
  }

  public render () {
    const match = this.props.match || matchDummy;
    const path = this.determinePath()

    return (
      <article className="shipment-layout">
        <ActionCable
          ref={elem => this.actionCableRef = elem}
          channel={{ channel: 'UserChannel' }}
          onReceived={this.handleReceivedNotifications}
        />
        <header className="shipment-layout__header">
          {this.props.shipmentTitle}
          <div className="shipment-layout__header-button-group">
            {(this.props.shipmentStatus === 'proposed_quote') && (
              <ForbiddenEditHider resource={resourceKey.shipment}>
                <Button
                  className="shipment-layout__header-button"
                  color="green"
                  onClick={this.acceptQuote}
                >
                  <i className="shipment-layout__header-button-icon icon check" />
                  Accept Quote
                </Button>
              </ForbiddenEditHider>
            )}
            {(includes(cancellableStatuses, this.props.shipmentStatus)) && (
              <ForbiddenEditHider resource={resourceKey.shipment}>
                <Button
                  className="shipment-layout__header-button"
                  color="white"
                  onClick={this.openDialog}
                >
                  <i className="shipment-layout__header-button-icon icon trash" />
                  Cancel Booking
                </Button>
              </ForbiddenEditHider>
            )}
            <Button
              className="shipment-layout__header-button"
              color="white"
              onClick={this.back}
            >
              Back
            </Button>
          </div>
        </header>
        <Paper >
          <header className="shipment-layout__navigation">
            <Tabs
              value={routeToTabName(this.props.location.pathname)}
              classes={{
                root: 'shipment-layout__tab-panel mui-override',
                indicator: 'shipment-layout__tab-indicator mui-override',
                flexContainer: 'shipment-layout__tab-container mui-override',
              }}
            >
              {tabMap[this.props.permission].map(this.renderTab)}
            </Tabs>
            <div className="shipment-layout__navigation-button-container">
              <IconedButton
                color="grey-outline"
                icon="link"
                title="Link"
                className="shipment-layout__navigation-button"
                onClick={this.copyLink}
              />
            </div>
          </header>
          <section className="shipment-layout__content">
            <Switch>
              <Route path="/shipments/:id/overview" component={ShipmentOverview} />
              <Route path="/shipments/:id/instructions" component={ShipmentInstructions} />
              <Route path="/shipments/:id/documentation" component={ShipmentDocs} />
              <Route path="/shipments/:id/track" component={ShipmentTrack} />
              <Route path="/shipments/:id/price-structure" component={ShipmentPrice} />
              <Route path="/shipments/:id/conversations/:messageId" component={ShipmentChat} />
              <Route path="/shipments/:id/conversations/" component={ShipmentChat} />
              <Redirect from="/shipments/:id/edit" to={`/shipments/:id/${path}`} />
              <Redirect to={`${match.url}/overview`} />
            </Switch>
          </section>
        </Paper>
        <ConfirmDialog
          title="Cancel booking"
          message={`Are you sure you want to cancel "${this.props.shipmentTitle}"?`}
          isOpen={this.state.dialogIsOpen}
          confirm={this.deleteShipment}
          reject={this.closeDialog}
          onClose={this.closeDialog}
        />
      </article>
    );
  }

  @bind
  private renderTab({ label, value, badgeFieldName = '' }: ITabProps){
    const id = get(this.props.match, 'params.id', 0);
    return (
      <Tab
        key={value}
        basePath={joinUrl('/shipments/', id)}
        classes={tabClasses}
        value={value}
        label={
          badgeFieldName
            ? this.renderCountBadge(label, badgeFieldName)
            : label
        }
      />
    )
  }

  private renderCountBadge(label: string, field: string) {
    const { counters } = this.props;
    const { counters: localCounters } = this.state;
    if (get(localCounters, field) || get(counters, field)) {
      return (
        <span>
          {label}
          <span className="shipment-layout__tab-text__badge">
            {localCounters[field] || counters[field]}
          </span>
        </span>
      )
    } else { return label }
  }

  private determinePath(): string {
    const hash = location.hash.replace('#', '');
    let path = 'overview';
    switch (hash) {
      case 'shipping-overview':
        path = 'overview';
        break;
      case 'shipping-instructions':
        path = 'instructions';
        break;
      case 'shipment-documentation':
        path = 'documents';
        break;
      case 'shipment-track':
        path = 'track';
        break;
      case 'shipment-price-structure':
        path = 'price-structure';
        break;
      case 'conversation':
        path = 'conversations';
        break;
      default:
        path = 'overview';
        break;
    }
    return path;
  }

  @bind
  private openDialog(): void{
    this.setState({ dialogIsOpen: true })
  }

  @bind
  private closeDialog(): void{
    this.setState({ dialogIsOpen: false })
  }

  @bind
  private copyLink(event: any):void {
    const token = this.props.shipmentToken;
    const inp = document.createElement('input');
    const siteUrl = selfURL.endsWith('/') ? selfURL : `${selfURL}/`;
    inp.style.position = 'absolute';
    inp.style.left = '-99999999px';
    event.currentTarget.appendChild(inp);
    inp.value = `${siteUrl}public-shipments/${token}`;
    inp.select();
    document.execCommand('copy', false);
    event.currentTarget.removeChild(inp);
    this.props.showSuccess('Sharable link is copied to you clipboard.');
  }

  private getDestination(routeEnd: string): string {
    const id = get(this.props.match, 'params.id', 0);
    return `/shipments/${id}/${routeEnd}`
  }

  @bind
  private switchTab(event: any, value: string ):void {
    const { toLocation, queryString } = this.props;
    if (toLocation) {
      toLocation({
        pathname: this.getDestination(value),
        search: queryString,
      });
    }
  }

  @bind
  private back(): void {
    const { queryString, toLocation } = this.props;
    if(toLocation) {
      const query = parse(queryString);
      toLocation(query.from || '/shipments/')
    }
  }

  @bind
  private handleReceivedNotifications(response: any): void {
    Logger.log('UserChannel:', response.message_type, response.message);

    if (
      response.message_type === 'unread_count'
      && +response.shipment_id === +this.props.match!.params.id
    ) {
      this.setState({
        counters: {
          ...this.state.counters,
          conversation: response.message,
        }
      });
    } else if (response.message_type === 'unread_notifications') {
      // this.setState({
      //   counters: {
      //     ...this.state.counters,
      //     conversation: response.message.data.comments.filter((c) => c.shipment_id === +this.props.match!.params.id).length,
      //   }
      // });
    }
  };

  @bind
  private async deleteShipment(): Promise<any> {
    const { deleteShipment, showError, showSuccess, match } = this.props;
    const id = get(match, 'params.id', 0);
    if (deleteShipment && id) {
      try {
        await deleteShipment(id);
        this.back();
        if (showSuccess) {
          showSuccess('Booking is successfully canceled');
        }
      } catch(error) {
        Logger.error(error);
        if (showError) {
          showError('Couldn\'t delete this shipment');
        }
      }
    }
  }

  @bind
  private async acceptQuote(): Promise<any> {
    const {
      acceptQuote,
      showError,
      showSuccess,
      match,
      toLocation,
      queryString,
    } = this.props;
    const id = get(match, 'params.id', 0);
    if (acceptQuote && id) {
      try {
        await acceptQuote(id);
        if (toLocation) {
          toLocation({
            pathname: `/shipments/${id}/overview/`,
            search: queryString,
          });
        }
        if (showSuccess) {
          showSuccess('Booking confirmed');
        }
      } catch(error) {
        Logger.error(error);
        if (showError) {
          showError('Couldn\'t accept quote');
        }
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShipmentLayout);
