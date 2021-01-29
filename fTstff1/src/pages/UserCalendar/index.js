import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { getUserRequestsRequest } from 'api/userRequestApi';
import { getAllAnnouncements } from 'api/announcementApi';
import { formatDataForCalendar } from 'utils';
import { connectGlobalUser } from 'store/connections';

import { Calendar } from 'ui';

class UserCalendar extends Component {
  state = {
    requests: [],
    ads: [],
    sort: ['id', 'DESC']
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    await this.getAnnouncements();
    await this.getArr();
  };

  getAnnouncements = async (sort = this.state.sort) => {
    try {
      const { data } = await getAllAnnouncements(sort);
      const ads = data.map((elem) => formatDataForCalendar(elem));
      this.setState({ ads });
    } catch (err) {
      console.log(err);
    }
  };

  getArr = async () => {
    try {
      const { data: res } = await getUserRequestsRequest(
        this.props.user.id
      );
      this.setState({
        requests: res
      });
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { requests, ads } = this.state;
    return (
      <StyledContainer className="container">
        <Calendar
          globalUser={this.props.user}
          requests={requests}
          ads={ads}
          readOnly
        />
      </StyledContainer>
    );
  }
}

const StyledContainer = styled.div`
  padding-top: 40px;
  padding-bottom: 150px;
  max-width: 90%;
  margin: 0 auto;

  .pageTitle {
    padding-bottom: 30px;
    text-align: center;
  }
`;

UserCalendar.propTypes = {
  user: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  )
};

UserCalendar.defaultProps = {
  user: {}
};

export default connectGlobalUser(UserCalendar);
