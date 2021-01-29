import React, { PureComponent } from 'react';
import { LocationDescriptor } from 'history';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Link } from "react-router-dom";
import { Dispatch } from 'redux';
import { stringify } from 'query-string';
import { toLower } from 'lodash';
import moment from 'moment';
import bind from 'autobind-decorator';

import { Paper, DateBox, ShipmentRangedProgress, LoadableContainer } from '../../components';
import { promisifyAction, Logger } from '../../utils';
import { quotesGetData } from '../../stores/actionCreators';
import { DATE_FORMAT } from '../../config/constants';
import './styles.scss';
import './quote.scss';

function getDaysInTransit(etaString: string, etdString: string): number {
  const eta = moment(etaString, DATE_FORMAT);
  const etd = moment(etdString, DATE_FORMAT);
  return moment.duration(eta.diff(etd)).days()
}

interface IQuotesProps{
  toLocation: (location: LocationDescriptor) => void;
  getQuotes: IActionPromiseFactory;
  quotes?: IQuote[];
  match: IMatch;
}

interface IQuotesState{
  busy: boolean;
}


const mapStateToProps = (state: IGlobalState) => ({
  quotes: state.quotes.list,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getQuotes: promisifyAction(dispatch, quotesGetData),
  toLocation(location: LocationDescriptor): void { dispatch(push(location)); },
});

class Quotes extends PureComponent<IQuotesProps, IQuotesState> {
  public static defaultProps = {
    toLocation():void {},
    quotes: [],
    match: {
      url: '',
      params: {},
      path: '/quotes/',
    },
  };

  public readonly state = {
    busy: false,
  };

  public async componentDidMount(): Promise<any> {
    this.setState({ busy: true });
    try {
      await this.props.getQuotes()
    } catch(error) {
      Logger.error(error)
    } finally {
      this.setState({ busy: false })
    }
  }

  public render() {
    const quotes = this.props.quotes || [];
    return (
      <Paper
        title="Quotes"
        icon="none"
        className="quotes-page"
        padded={true}
      >
        <LoadableContainer loading={this.state.busy}>
          {quotes.map(this.renderQuote)}
        </LoadableContainer>
      </Paper>
    );
  }

  @bind
  private renderQuote(quote: IQuote){
    let startIcon = 'cargo';
    let endIcon = 'cargo';

    if (toLower(quote.container_type) === 'air'){
      startIcon = 'air-depart';
      endIcon = 'air-arrive';
    }
    return (
      <Link className="quote__link" to={`/shipments/${quote.id}/overview?${stringify({ from: this.props.match.path })}`}>
      <section
        key={quote.id}
        className="quote"
      >
        <div className="quote__route">
          <div className="quote__route-port">
            <DateBox date={quote.estimated_departure} />
            <div className="quote__route-date--short">{moment(quote.estimated_departure, 'YYYY-MM-DD').format('MMM D')}</div>
            <div className="quote__route-text">
              {quote.loading_port_code}
              <span className={`quote__flag flag-icon flag-icon-${quote.loading_port_country.toLowerCase()}`}/>
              <div className="quote__route-city">
                {`${quote.loading_port}, ${quote.loading_port_country}`}
              </div>
            </div>
          </div>
          <div className="quote__route-progress">
            <ShipmentRangedProgress
              startIcon={startIcon}
              endIcon={endIcon}
              progress={100}
              daysInTransit={getDaysInTransit(quote.estimated_arrival, quote.estimated_departure)}
            />
          </div>
          <div className="quote__route-port quote__route-port_destination">
            <DateBox date={quote.estimated_arrival} />
            <div className="quote__route-date--short">{moment(quote.estimated_arrival, 'YYYY-MM-DD').format('MMM D')}</div>
            <div className="quote__route-text">
              {quote.discharge_port_code}
              <span className={`quote__flag flag-icon flag-icon-${quote.discharge_port_country.toLowerCase()}`}/>
              <div className="quote__route-city">
                {`${quote.discharge_port}, ${quote.discharge_port_country}`}
              </div>
            </div>
          </div>
        </div>
        <div className="quote__field-container">
          <div className="quote__field">
            <div className="quote__field-name">Id</div>
            <div className="quote__field-value">{quote.title}</div>
          </div>
          <div className="quote__field">
            <div className="quote__field-name">Reference</div>
            <div className="quote__field-value">
              {quote.reference_number || '-'}
            </div>
          </div>
          <div className="quote__field">
            <div className="quote__field-name">Status</div>
            <div className="quote__field-value">{quote.humanized_status}</div>
          </div>
        </div>
      </section>
      </Link>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Quotes)
