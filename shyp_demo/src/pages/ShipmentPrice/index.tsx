import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { promisifyAction } from '../../utils';
import { shipmentPriceGetData } from '../../stores/actionCreators';
import { Logger } from '../../utils/Logger';
import './styles.scss';


interface IShipmentPriceProps {
  match: IMatch | null;
  getData: IActionPromiseFactory;
}

interface IShipmentPriceState {
  data: any;
}

interface IServiceItem {
  description: string;
  included: boolean;
  on_request: boolean;
  quantity: boolean;
  price_eur: string;
  price_usd: string;
  remark: string;
  unit_price: string;
}

interface IService {
  icon_class: string;
  name: string;
  items: IServiceItem[];
}

const mapDispatchToProps = ( dispatch: Dispatch ) => ({
  getData: promisifyAction(dispatch, shipmentPriceGetData),
});

const mapStateToProps = (state: IGlobalState): any => ({
  data: state.shipmentPrice.data,
});

const itemValue = (item: IServiceItem, field: string): any => {
  if (item.on_request) {
    return '-'
  } else if (item.included) {
    return '-'
  } else {
    return item[field]
  }
};

const itemPrice = (item: IServiceItem): any => {
  if (item.on_request) {
    return <span className="red">On Request</span>
  } else if (item.included) {
    return <span>Included</span>
  } else {
    return item.price_eur
  }
};

const initialState = {
  data: {
    services: [],
  },
};


class ShipmentsPrice extends PureComponent<IShipmentPriceProps, IShipmentPriceState> {
  public static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
      url: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    }),
  };
  public static defaultProps = {};

  constructor (props, context) {
    super(props, context);
    this.state = initialState;
  }

  public async componentDidMount(): Promise<any>{
    try {
      await this.props.getData(this.props.match!.params.id);
    } catch(error) {
      Logger.log(error)
    }
  }

  public componentWillReceiveProps(nextProps) {
    this.setState({data: nextProps.data});
  }

  public render () {
    return (
      <div className="costs">
        <div className="costs__header">
          <i className="icon list costs__header__icon"/>
          Price Structure
        </div>
        <div className="costs__table">
          <div className="costs__table__header">
            <div className="item">
              <div className="item__unit item__unit-price">Unit Price</div>
              <div className="item__unit item__price-usd">Price (USD)</div>
              <div className="item__unit item__price-eur">Price (EUR)</div>
            </div>
          </div>
          <div className="costs__table__content">
            {this._renderTable()}
          </div>
          {this._renderTableTotals()}
        </div>
      </div>
    );
  }

  private _renderTable() {
    return this.state.data.services.map((service: IService, i: number) => {
      return (
        <div className="item" key={i}>
          <div className="item__header">
            <i className={`icon ${service.icon_class || 'ait'}`} />
            {service.name}
          </div>
          {this._renderServiceItems(service.items)}
        </div>
      )
    })
  }

  private _renderTableTotals() {
    let requestedString : string = '';

    if ((this.state.data.requested_items || []).length) {
      requestedString = `, ${this.state.data.requested_services_string})`;
    }
    let totalString = `Total (Excluding VAT${requestedString})`
    if (this.state.data.total_eur_float > 0) {
      return (
        <div className="costs__table__footer">
          <div className="costs__table__footer__label">
            { totalString }
          </div>
          <div className="item__unit item__unit-price">{this.state.data.total_usd}</div>
          <div className="item__unit item__unit-price">{this.state.data.total_eur}</div>
        </div>
      )
    } else { return }

  }

  private _renderServiceItems(items: IServiceItem[]) {
    return items.map((item: IServiceItem, i:number) => {
      return (
        <div className="item__content" key={i}>
          <div className="item__content__details">
            {item.quantity} x <span className="item__content__details__description">{item.description}</span>
          </div>
          <div className="item__unit item__unit-price">{itemValue(item, 'unit_price')}</div>
          <div className="item__unit item__unit-price">{itemValue(item, 'price_usd')}</div>
          <div className="item__unit item__unit-price">{itemPrice(item)}</div>
        </div>
      )
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShipmentsPrice);
