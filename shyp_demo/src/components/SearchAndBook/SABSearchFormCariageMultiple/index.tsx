import React, { PureComponent } from 'react';
import './styles.scss';
import { Counter } from '../../'

class SABSearchFormCariageMultiple extends PureComponent<any, any> {
  public state = {
    selectedType: 'lcl',
    selectedCount: 0,
    count20ft: 0,
    count40ft: 0,
    count40fthq: 0,
  };

  public changeType = value => {
    this.setState({selectedType: value})
  };

  public changeCount = event => {
    const { name, value } = event.target;
    if (value.match(/^[0-9]*$/)) {
      this.setState({[name]: parseInt(value,10)})
    }
  };

  public render () {
    return (
      <div className="search-form__cariage-multiple">
        <div className="carige-multiple__item" >
          <label htmlFor="count20ft">
            20&nbsp;FT
          </label>
          <span className="icon container20ft"/>
          <Counter value={this.state.count20ft} inc={this.increment} dec={this.decrement} change={this.changeCount} name="count20ft" />
        </div>
        <div className="carige-multiple__item" >
          <label htmlFor="count40ft">
            40&nbsp;FT
          </label>
          <span className="icon container40ft"/>
          <Counter value={this.state.count40ft} inc={this.increment} dec={this.decrement} change={this.changeCount} name="count40ft" />
        </div>
        <div className="carige-multiple__item" >
          <label htmlFor="count40fthq">
            40&nbsp;HQ
          </label>
          <span className="icon container40fthq"/>
          <Counter value={this.state.count40fthq} inc={this.increment} dec={this.decrement} change={this.changeCount} name="count40fthq" />
        </div>
      </div>
    );
  }

  private increment = event => {
    const name = event.target.name;
    this.setState((state) => ({[name]: state[name] + 1}))
  };

  private decrement = event => {
    const name = event.target.name;
    if (this.state[name] > 0) {
      this.setState((state) => ({[name]: state[name] - 1}))
    }
  };
}

export default SABSearchFormCariageMultiple;
