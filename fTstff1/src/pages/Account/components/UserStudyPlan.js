import React, { Component } from 'react';
import PropTypes from 'prop-types';

import UserJob from './UserJob';

class UserStudyPlan extends Component {
  render() {
    const { jobs } = this.props;
    return (
      <>
        {jobs &&
          jobs.map((job, index) => {
            const id = index;
            return <UserJob job={job} key={id} />;
          })}
      </>
    );
  }
}

UserStudyPlan.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.any)
};

UserStudyPlan.defaultProps = {
  jobs: []
};

export default UserStudyPlan;
