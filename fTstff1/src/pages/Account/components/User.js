import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { avatarSelector } from 'utils';

import Avatar from './Avatar';

class Info extends Component {
  render() {
    const { user } = this.props;
    const avatar = avatarSelector(user.avatar);

    return (
      <div style={style.container}>
        <Avatar globalUser={this.props.globalUser} src={avatar} />

        <b>
          {this.props.user.firstName} {this.props.user.lastName}
        </b>
        <hr />
      </div>
    );
  }
}

const style = {
  container: { fontSize: '20px' }
};

Info.propTypes = {
  user: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array])
  ).isRequired,
  globalUser: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array])
  ).isRequired
};

export default Info;
