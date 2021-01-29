import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class ConfirmableDelete extends PureComponent {
  static propTypes = {
    className: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
    children: PropTypes.node,
    text: PropTypes.string,
  };

  static defaultProps = {
    children: null,
    text: 'Are you sure you want to delete this item?',
  };

  handleClick = () => {
    const { text } = this.props;

    if (window.confirm(text)) { // eslint-disable-line
      this.props.onDelete();
    }
  };

  render() {
    const { children, className } = this.props;

    return (
      <div
        className={className}
        onClick={this.handleClick}
      >
        {children}
      </div>
    );
  }
}

export default ConfirmableDelete;
