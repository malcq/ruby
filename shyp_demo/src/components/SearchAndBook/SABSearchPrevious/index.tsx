import React, { PureComponent } from 'react';
import './styles.scss';
import { Paper } from '@material-ui/core'
import 'flag-icon-css/css/flag-icon.css';
import Row from './Row'

class SABSearchPrevious extends PureComponent<any, any> {
  public render() {
    if (!(this.props.searchPrevious || []).length) {
      return (<div/>)
    }

    return (
      <div className="search-previous">
        <div className="search-previous__title">
          Previous Searches
        </div>
        <Paper className="search-previous__content">
          {this.props.searchPrevious.length !== 0 && this.props.searchPrevious.map((item, index) => (<Row key={'k-'+index+item.id} item={item} setForceUpdate={this.props.setForceUpdate} />)
          )}
        </Paper>
      </div>
    );
  }
}

export default SABSearchPrevious;
