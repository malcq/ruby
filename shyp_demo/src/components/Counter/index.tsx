import React, { PureComponent } from 'react';
import './styles.scss';
import getClassName from "../../utils/styling/index";

class Counter extends PureComponent<any, any> {
  public counterInput: HTMLInputElement | null;
  public state = {totalError: this.props.totalError};
  public componentDidUpdate(prevProps, prevState) {
    if (prevProps.totalError !== this.props.totalError) {
      this.setState({
        totalError: this.props.totalError
      });
      if (this.counterInput) {
        this.counterInput.focus();
      }
    }
  }
  public render () {
    return (
      <div className="cariage-count">
        <button
          className="cariage-count__button cariage-count__button--desc"
          name={this.props.name}
          onClick={this.props.dec}
          disabled={this.props.value < 2}
        >-</button>
        <input
          className={getClassName("cariage-count__input",{'error-field': this.state.totalError})}
          name={this.props.name}
          value={this.props.value}
          id={this.props.name}
          onChange={this.props.change}
          min="1"
          onBlur={this.removeError}
          ref={c => (this.counterInput = c)}
        />
        <button
          className="cariage-count__button cariage-count__button--asc"
          name={this.props.name}
          onClick={this.props.inc}>+</button>
        <div className={getClassName('error-holder', {'hidden': !this.state.totalError})}>{this.state.totalError}</div>
      </div>
    );
  }

  private removeError = event => {
    this.setState({totalError: ''})
  };
}

export default Counter;
