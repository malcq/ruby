import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { CardLink } from 'reactstrap';

class Link extends PureComponent {
  static propTypes = {
    href: PropTypes.string,
    text: PropTypes.string,
  };

  static defaultProps = {
    href: null,
    text: null,
  };

  render() {
    const { href, text } = this.props;

    if (!href) {
      return null;
    }

    return (
      <CardLink
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {text}
      </CardLink>
    );
  }
}

export default Link;
