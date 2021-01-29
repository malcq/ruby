import * as React from 'react';
import { Tabs, Tab } from '@material-ui/core'
import bind from 'autobind-decorator';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Dispatch } from 'redux';
import { pick, values, get, includes } from 'lodash';
import { stringify } from 'query-string';

import { Paper, Button, LoadableContainer } from '../../components';
import { ratesGetData, flashError } from '../../stores/actionCreators';
import { promisifyAction } from '../../utils';
import './styles.scss';




type RatesTab = 'fcl_import'
  | 'lcl_import'
  | 'fcl_export'
  | 'lcl_export';

interface IRatesProps {
  rates?: { [x: string]: IRate[] };
  getRates: IActionPromiseFactory;
  showError: (message: string) => void;
}

interface IRatesState {
  rates: { [x: string]: IRate[] };
  search: string;
  tab: RatesTab;
  busy: boolean;
}

interface IQueryObject {
  [x: string]: string | string[];
}

const ratesPageTab = {
  root: 'rates-page__tab media-override mui-override',
  labelContainer: 'rates-page__tab-text mui-override',
  selected: 'rates-page__tab_selected mui-override'
};

const mapStateToProps = (state: IGlobalState) => ({
  rates: pick(state.rates, [
    'fcl_import', 'lcl_import', 'fcl_export', 'lcl_export'
  ]),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getRates: promisifyAction(dispatch, ratesGetData),
  showError(message: string): void { dispatch(flashError(message)); },
});

const rateMapFCL: IRateAccessor[] = [
  { title: 'From', note: '(POL)', field: 'loading_port' },
  { title: 'To', note: '(POD)', field: 'discharge_port' },
  {
    title: 'Validity',
    note: 'Latest ETD',
    field: 'validity',
    convert: (value: string):string => value.slice(0, 10)
  },
  { title: 'Loading Port', note: 'All charges', field: 'loading_port_thc' },
  { title: '20FT', note: '', field: 'twenty_ft' },
  { title: '40FT', note: '', field: 'fourty_ft' },
  { title: '40FT HC', note: '', field: 'fourty_ft_hc' },
  { title: 'Discharge Port', note: 'All charges', field: 'discharge_port_thc' },
  { title: '', note: '' },
];

const rateMapLCL: IRateAccessor[] = [
  { title: 'From', note: '(POL)', field: 'loading_port' },
  { title: 'To', note: '(POD)', field: 'discharge_port' },
  {
    title: 'Validity',
    note: 'Latest ETD',
    field: 'validity',
    convert: (value: string):string => value.slice(0, 10)
  },
  { title: 'Ocean Freight', note: 'per W/M', field: 'seafreight' },
  { title: 'Unloading', note: 'POD CFS per W/M', field: 'unloading_m3' },
  { title: 'Delivery Order', note: 'POD CFS per shipment', field: 'delivery_fee' },
  { title: '', note: ''},
];

const rateMapLCLExportDifference = {
  unloading_m3: { title: 'Loading', note: 'POL CFS per W/M' },
};

const rateMap = {
  fcl_export: rateMapFCL.filter(({ field }: IRateAccessor) =>
    !includes(['discharge_port_thc'], field)
  ),
  fcl_import: rateMapFCL.filter(({ field }: IRateAccessor) =>
    !includes(['loading_port_thc'], field)
  ),
  lcl_export: rateMapLCL.map(
    (column: IRateAccessor): IRateAccessor => column.field && rateMapLCLExportDifference[column.field]
      ? { ...column, ...rateMapLCLExportDifference[column.field] }
      : column
  ),
  lcl_import: rateMapLCL,
};

const disclamerText = {
  fcl_import: [
    'All-in Raw Ocean freight charges (incl. CAF, BAF and other surcharges etc.)',
    'Excluding: Low sulphur surcharge: 25 USD / TEU',
    'DEM/DET upon request - commonly 7/10 days free',
  ],
  lcl_import: [
    'All-in Ocean freight charges',
    'All-in container freight station handling charges',
    'CFS Free days upon request - commonly 3+ days free',
  ],
  fcl_export: [
    'All-in Raw Ocean freight charges (incl. CAF, BAF and other surcharges etc.)',
    'DEM/DET upon request - commonly 7/10 days free',
  ],
  lcl_export: [
    'All-in Ocean freight charges',
    'All-in container freight station handling charges',
    'CFS Free days upon request - commonly 3+ days free',
  ]
};



const stringifyParams = (queryObject: any) =>
  stringify(queryObject, { arrayFormat: 'bracket' })
  .replace(/%2C/gi, ',');  // We need this comma to be displayed as comma at Search.

interface IRateAccessor{
  title: string,
  note: string,
  field?: keyof IRate,
  convert?: (value: string | number) => string;
}

const ratesDummy = {
  fcl_export: [],
  fcl_import: [],
  lcl_export: [],
  lcl_import: [],
};

class Rates extends React.Component<IRatesProps, IRatesState> {
  public static defaultProps = {
    rates: ratesDummy,
  };

  public readonly state = {
    tab: 'fcl_import' as RatesTab,
    search: '',
    busy: false,
    rates: ratesDummy,
  };

  public async componentDidMount():Promise<any> {
    this.setState({ busy: true });
    try {
      await this.props.getRates();
      if (this.state.search) {
        this.search(this.state.search);
      }
    } catch(error) {
      this.props.showError('Was unable to load rates')
    } finally {
      this.setState({ busy: false })
    }
  }

  public render() {
    const { tab, search, busy } = this.state;
    const ratesObj = (search) ? this.state.rates : this.props.rates;
    const rates: IRate[] = get(ratesObj, tab, []);


    return (
      <article className="rates-page">
        <Paper className="rates-page__header">
          <i className="rates-page__search-icon icon search"/>
          <input
            value={search}
            onChange={this.handleSearchChange}
            className="rates-page__search-input"
            type="text"
            placeholder="Search rates"
          />
        </Paper>
        <Paper className="rates-page__content">
          <header className="rates-page__content-header">
            <Tabs
              value={tab}
              classes={{
                root: 'rates-page__tab-panel mui-override',
                flexContainer: 'rates-page__tab-panel-container mui-override',
                indicator: 'rates-page__tab-indicator mui-override',
                scroller: 'rates-page__tab-panel-scroller mui-override'
              }}
              onChange={this.switchTab}
            >-scroller
              <Tab
                label={`FCL Import (${get(ratesObj, 'fcl_import.length', 0)})`}
                value="fcl_import"
                classes={ratesPageTab}
              />
              <Tab
                label={`LCL Import (${get(ratesObj, 'lcl_import.length', 0)})`}
                value="lcl_import"
                classes={ratesPageTab}
              />
              <Tab
                label={`FCL Export (${get(ratesObj, 'fcl_export.length', 0)})`}
                value="fcl_export"
                classes={ratesPageTab}
              />
              <Tab
                label={`LCL Export (${get(ratesObj, 'lcl_export.length', 0)})`}
                value="lcl_export"
                classes={ratesPageTab}
              />
            </Tabs>
            <article className="rates-page__disclaimer">
              {disclamerText[tab].map(this.renderDisclaimerLine)}
            </article>
          </header>
          <LoadableContainer
            loading={busy}
            className="rates-page__loading"
          >
            <section className="rates-page__table">
              <header className="rates-page__table-row rates-page__table-row_header">
                {rateMap[tab].map(({ title, note }) => (
                  <div key={title} className="rates-page__table-cell rates-page__table-cell_header">
                    {title}
                    <div className="rates-page__table-cell_note">{note}</div>
                  </div>
                ))}
              </header>
              {rates.length > 0
                ? rates.map(this.renderRate)
                : <article className="rates-page__table-placeholder">
                  <i className="rates-page__table-placeholder-icon icon rates" />
                  Sorry, you don't have standard tradelanes set-up. Contact the Shypple Team to add a few!
                </article>
              }
            </section>
          </LoadableContainer>
        </Paper>
      </article>
    );
  }

  @bind
  private renderDisclaimerLine(line: string, index: number) {
    return  (
      <p
        key={`${index}${this.state.tab}.disclaimer`}
        className="rates-page__disclaimer-line"
      >
        {line}
      </p>
    )
  }

  @bind
  private renderRate(rate: Pick<IRate, keyof IRate>): any{
    const { tab } = this.state;
    return(
      <article
        key={rate.id}
        className="rates-page__table-row"
      >
        {rateMap[tab].map(({ field, convert }: IRateAccessor)=> field && (
          <div
            key={`${rate.id}${field}`}
            className="rates-page__table-cell"
          >
            {(convert)
              ? convert(rate[field] as string || '')
              : rate[field] as string || 'N / A'
            }
          </div>
        ))}
        <div
          className="rates-page__table-cell"
        >
          <Link
            to={{
              pathname: '/search',
              search: stringifyParams(rate.request_quote_params)
            }}
          >
            <Button
              color="blue-border"
              className="rates-page__table-button"
            >
              Routes
            </Button>
          </Link>
        </div>
      </article>
    )
  }

  @bind
  private switchTab(event: any, value: RatesTab ):void {
    this.setState({ tab: value });
  }

  private contains(str: string, rate: Pick<IRate, keyof IRate>): boolean {
    const searchString = str.toLowerCase()
    return values(rate).some(value => `${value}`.toLowerCase().includes(searchString))
  }

  private search(search: string): void {
    const rates = this.props.rates || ratesDummy;
    const contains = this.contains.bind(this, search);
    this.setState({
      rates: {
        fcl_import: rates.fcl_import.filter(contains),
        fcl_export: rates.fcl_export.filter(contains),
        lcl_import: rates.lcl_import.filter(contains),
        lcl_export: rates.lcl_export.filter(contains),
      }
    })
  }

  @bind
  private handleSearchChange(event: any): void {
    const search = event.currentTarget.value;
    this.search(search);
    this.setState({ search });
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Rates)
