import * as React from 'react';
import './styles.scss';
import { CircularProgress } from '@material-ui/core';
import { SABSearchForm, SABSearchResult, SABSearchPrevious } from '../../components';
import {connect} from "react-redux";
import {Dispatch} from "redux";
import { searchPrevious,searchQuotesSort } from '../../stores/actionCreators';
import promisifyAction from "../../utils/promisifyAction";
import moment from 'moment';
import {searchQuotesReset} from "../../stores/actionCreators/searches";

const mapStateToProps = (state: any): any => ({
  loading: state.searches.loading || state.searchPrevious.loading,
  searchResult: state.searches.routes,
  searchPrevious: state.searchPrevious.routes,
  is_staff: state.user.isStaff,
});

const mapDispatchToProps = ( dispatch: Dispatch ) => ({
  getData: promisifyAction(dispatch, searchPrevious),
  sortResults: promisifyAction(dispatch, searchQuotesSort),
  searchQuotesReset: promisifyAction(dispatch, searchQuotesReset)
});

const sortIdMap = {
  'Price': 'total_usd',
  'Transit Time': 'estimated_transit_time',
  'Departure Time': 'estimated_departure',
};

class SearchAndBook extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      query: {},
      force: false,
      sort: 'Price'
    };
  };
  public sortResult = (type) => {
    this.setState({ sort: type });
    this.props.sortResults(sortIdMap[type] || 'total_usd');
  };

  public setQuery = query => {
    this.setState({ query })
  };

  public componentDidMount() {
    this.props.getData();
  }

  public componentWillMount() {
    this.props.searchQuotesReset();
  }

  public setForceUpdate = val => {
    this.setState({ force: val })
  };

  public render() {
    return (
      <div>
        <SABSearchForm
          setQuery={this.setQuery}
          setForceUpdate={this.setForceUpdate}
          force={this.state.force}
        />
        <SABSearchResult
          resultSearch={this.props.searchResult}
          date={this.state.query.departure_date || moment()}
          query={this.state.query}
          sortF={this.sortResult}
          sortType={this.state.sort}
          isStaff={this.props.is_staff}
          setForceUpdate={this.setForceUpdate}
          search={this.props.location.search}
        />
        <SABSearchPrevious searchPrevious={this.props.searchPrevious} setForceUpdate={this.setForceUpdate} />
        {this.props.loading && (
          <div className="sab__loader">
            <CircularProgress size={50} style={{marginTop: '160px'}}/>
          </div>
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchAndBook);