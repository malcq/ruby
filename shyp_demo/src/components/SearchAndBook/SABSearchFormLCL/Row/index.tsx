import React, { PureComponent } from 'react';
import {Counter} from "../../../";
import getClassName from "../../../../utils/styling/index";

class SABSearchFormLCLRow extends PureComponent<any, any> {
  public lengthInput: HTMLInputElement | null;
  public widthInput: HTMLInputElement | null;
  public heightInput: HTMLInputElement | null;
  public weightInput: HTMLInputElement | null;
  public state = {
    id: this.props.row.id,
    length: this.props.row.length,
    lengthError: this.props.row.lengthError,
    width: this.props.row.width,
    widthError: this.props.row.widthError,
    height: this.props.row.height,
    heightError: this.props.row.heightError,
    volume: this.props.row.volume,
    weight: this.props.row.weight,
    weightError: this.props.row.weightError,
    total: this.props.row.total,
    totalError: this.props.row.totalError,
    deletable: this.props.deletable
  };
  public changeCount = event => {
    const { name, value } = event.target;
    this.props.change(this.state.id, name, value, this.state[name+'Error'])
  };
  public componentWillReceiveProps(nextProps) {
    if (this.state !== nextProps.row) {
      this.setState(nextProps.row)
    }
  }

  public render () {
    const {length, lengthError, width, widthError, height, heightError, volume, weight, weightError, total, totalError, deletable} = this.state;
    return (
      <>
      <tr className="lcl__row-wide">
        <td>
          { deletable ? <span className="icon trash" onClick={()=>{this.props.remove(this.state.id)}}/> : <span style={{display: 'inline-block', width: 14}}/>}
          &nbsp;<span className="icon box" />
        </td>
        <td><input
          type="number"
          value={length}
          onChange={this.changeCount}
          name="length"
          className={lengthError ? 'error-field' : ''}
          min="1"
          max="1000"
          onFocus={this.removeError}
          ref={c => (this.lengthInput = c)}
        />
          <div className={getClassName('error-holder', {'hidden': !lengthError})}>{lengthError}</div>
        </td>
        <td><div className="icon close"/></td>
        <td><input
          type="number"
          value={width}
          onChange={this.changeCount}
          name="width"
          className={widthError ? 'error-field' : ''}
          min="1"
          max="500"
          onFocus={this.removeError}
          ref={c => (this.widthInput = c)}
        />
          <div className={getClassName('error-holder', {'hidden': !widthError})}>{widthError}</div>
        </td>
        <td><div className="icon close"/></td>
        <td><input
          type="number"
          value={height}
          onChange={this.changeCount}
          name="height"
          className={heightError ? 'error-field' : ''}
          min="1"
          max="240"
          onFocus={this.removeError}
          ref={c => (this.heightInput = c)}
        />
          <div className={getClassName('error-holder', {'hidden': !heightError})}>{heightError}</div>
        </td>
        <td>{volume}</td>
        <td><input
          type="number"
          value={weight}
          onChange={this.changeCount}
          name="weight"
          className={weightError ? 'error-field' : ''}
          min="1"
          onFocus={this.removeError}
          ref={c => (this.weightInput = c)}
        />
          <div className={getClassName('error-holder', {'hidden': !weightError})}>{weightError}</div>
        </td>
        <td><Counter totalError={totalError} value={total} change={this.changeCount} inc={this.increment} dec={this.decrement} name="total" /></td>
        <td/>
      </tr>
      <tr className="lcl__row-short">
        <td>
          { deletable ? <span className="icon trash" onClick={()=>{this.props.remove(this.state.id)}}/> : <span style={{display: 'inline-block', width: 14}}/>}
          &nbsp;<span className="icon box" />
        </td>
        <td><input
          type="number"
          value={length}
          onChange={this.changeCount}
          name="length"
          className={lengthError ? 'error-field' : ''}
          min="1"
          max="1000"
          onFocus={this.removeError}
          ref={c => (this.lengthInput = c)}
        />
          <div className={getClassName('error-holder', {'hidden': !lengthError})}>{lengthError}</div>
        </td>
        <td><div className="icon close"/></td>
        <td><input
          type="number"
          value={width}
          onChange={this.changeCount}
          name="width"
          className={widthError ? 'error-field' : ''}
          min="1"
          max="500"
          onFocus={this.removeError}
          ref={c => (this.widthInput = c)}
        />
          <div className={getClassName('error-holder', {'hidden': !widthError})}>{widthError}</div>
        </td>
        <td><div className="icon close"/></td>
        <td><input
          type="number"
          value={height}
          onChange={this.changeCount}
          name="height"
          className={heightError ? 'error-field' : ''}
          min="1"
          max="240"
          onFocus={this.removeError}
          ref={c => (this.heightInput = c)}
        />
          <div className={getClassName('error-holder', {'hidden': !heightError})}>{heightError}</div>
        </td>
        <td/>
      </tr>
      <tr className="lcl__row-short" style={{borderBottom: '1px solid grey', marginBottom: 10}}>
        <td/>
        <td>{volume}</td>
        <td/>
        <td><input
          type="number"
          value={weight}
          onChange={this.changeCount}
          name="weight"
          className={weightError ? 'error-field' : ''}
          min="1"
          onFocus={this.removeError}
          ref={c => (this.weightInput = c)}
        />
          <div className={getClassName('error-holder', {'hidden': !weightError})}>{weightError}</div>
        </td>
        <td/>
        <td><Counter totalError={totalError} value={total} change={this.changeCount} inc={this.increment} dec={this.decrement} name="total" /></td>
        <td/>
      </tr>
    </>
    );
  }

  private removeError = event => {
    this.setState({[event.target.name+'Error']: ''})
  };

  private increment = event => {
    const name = event.target.name;
    this.props.change(this.state.id, name, this.state[name] + 1)
  };

  private decrement = event => {
    const name = event.target.name;
    if (this.state[name] > 0) {
      this.props.change(this.state.id, name, this.state[name] - 1)
    }
  };
}

export default SABSearchFormLCLRow;
