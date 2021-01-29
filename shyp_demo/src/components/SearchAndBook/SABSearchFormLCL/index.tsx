import React, { PureComponent } from 'react';
import './styles.scss';
import SABSearchFormLCLRow from './Row'
import uuidv4 from  'uuid/v4';

class SABSearchFormLCL extends PureComponent<any, any> {
  public render () {
    return (
      <div className="search-form__lcl">
        <div className="lcl__row-short" style={{textAlign: 'right'}}><button className="lcl__add-button" onClick={this.add}>Add&nbsp;<span className="add-button__icon">+</span></button></div>
        <table>
          <thead>
            <tr className="lcl__row-wide">
              <td/>
              <td>Length (cm)</td>
              <td/>
              <td>Width (cm)</td>
              <td/>
              <td>Height (cm)</td>
              <td>Volume (m<sup>3</sup>)</td>
              <td>Weight (kg)</td>
              <td className="search-form__total">Total</td>
              <td><button className="lcl__add-button" onClick={this.add}>Add&nbsp;<span className="add-button__icon">+</span></button></td>
            </tr>
            <tr className="lcl__row-short">
              <td/>
              <td>Length/<br/>Volume</td>
              <td/>
              <td>Width/<br/>Weight</td>
              <td/>
              <td>Height/<br/>Total</td>
            </tr>
          </thead>
          <tbody>
            { this.props.lcl.map((item,index) => (<SABSearchFormLCLRow key={item.id} row={item} remove={this.remove} change={this.changeCount} deletable={index !== 0} />))}
          </tbody>
        </table>
      </div>
    );
  }
  public changeCount = (id, name, value, error)  => {
    if (typeof value === 'number' || value.match(/^[0-9]*$/)) {
      this.props.changeState('lcl',
        [
          ...this.props.lcl.map(item => {
            if (item.id === id) {
              item[name] = parseInt(value,10);
              item[name+'Error'] = error;
              item.volume = item.width * item.height * item.length / 1000000
              console.log('2',item[name+'Error'])
            }
            return item;
          })
        ])
    }
  };
  private remove = (id) => {
    this.props.changeState('lcl',
      [
        ...this.props.lcl.filter(item=>item.id !== id)
      ]);
  };

  private add = () => {
    this.props.changeState('lcl',
      [
        ...this.props.lcl,
        {
          id: uuidv4(),
          length: 100,
          width: 100,
          height: 100,
          volume: 1,
          weight: 500,
          total: 1},
      ]
    );
  }
}

export default SABSearchFormLCL;
