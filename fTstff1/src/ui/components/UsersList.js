import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getAllUsersRequest } from 'api/userApi';
import SmallCardInfo from './SmallCardInfo';

class UsersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
  }

  async componentDidMount() {
    try {
      let { data: users } = await getAllUsersRequest();
      users = users.filter((user) => user.status === 'active');
      this.setState({
        users
      });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { users } = this.state;
    return (
      <StyledContainer className={`${this.props.class}`}>
        <div className="box">
          {users.map((user) => (
            <SmallCardInfo key={user.login} user={user} />
          ))}
        </div>
      </StyledContainer>
    );
  }
}

const StyledContainer = styled.div`
  padding: 0 12px;

  & .box {
    margin: 0 auto;
    display: grid;
    max-width: 100%;
    grid-gap: 25px;
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 1200px) {
    & .box {
      grid-template-columns: 1fr;
      grid-gap: 18px;
    }
  }
`;

UsersList.propTypes = {
  class: PropTypes.string
};

UsersList.defaultProps = {
  class: ''
};

export default UsersList;
