import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import { Button } from 'reactstrap';

class Header extends PureComponent {
  static propTypes = {
    text: PropTypes.string.isRequired,
    buttonText: PropTypes.string,
    buttonUrl: PropTypes.string,
  };

  static defaultProps = {
    buttonText: null,
    buttonUrl: null,
  };

  renderActionButton = () => {
    const { buttonText, buttonUrl } = this.props;

    if (!buttonText && !buttonUrl) {
      return null;
    }

    return (
      <Button to={buttonUrl} tag={Link}>
        {buttonText}
      </Button>
    );
  };

  render() {
    const { text } = this.props;

    return (
      <div className="d-flex justify-content-between align-items-center my-3">
        <h1>{text}</h1>

        {this.renderActionButton()}
      </div>
    );
  }
}

export default Header;
