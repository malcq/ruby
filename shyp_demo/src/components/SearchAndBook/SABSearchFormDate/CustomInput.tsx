import * as React from 'react';
import './styles.scss';
import moment from "moment";

class CustomInput extends React.PureComponent<any, any> {
  public render () {
    return (<div onClick={this.props.onClick} style={{paddingRight: 5, fontSize: 16}}>
      {moment(this.props.value,'MM/DD/YYYY').format('DD/MM/YYYY')}
      &nbsp;
      <label htmlFor="date" className="icon calendar"/>
    </div>)
  }
}
export default CustomInput;
