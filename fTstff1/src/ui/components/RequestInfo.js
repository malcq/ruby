import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Typography } from '@material-ui/core';

class RequestInfo extends Component {
  render() {
    const {
      request: { title, comment, deniedComment },
      date,
      type
    } = this.props;
    return (
      <>
        <Typography gutterBottom noWrap>
          <b>Тип заявки: </b>
          {`${type}.`}
        </Typography>

        <Typography gutterBottom noWrap>
          <b>Заголовок: </b>
          {`${title}.`}
        </Typography>

        <Typography gutterBottom noWrap>
          <b>Когда: </b>
          {`${date}.`}
        </Typography>

        {comment !== '' && (
          <>
            <Typography gutterBottom noWrap style={style}>
              <b>Комментарий: </b>
            </Typography>

            <Typography gutterBottom style={style}>
              {comment}
            </Typography>
          </>
        )}

        {deniedComment && (
          <Typography gutterBottom style={style}>
            <b>Причина отказа: </b>
            {deniedComment}
          </Typography>
        )}
      </>
    );
  }
}

const style = {
  wordBreak: 'break-all',
  maxWidth: '100%'
};

RequestInfo.propTypes = {
  request: PropTypes.objectOf(PropTypes.any).isRequired,
  date: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

export default RequestInfo;
