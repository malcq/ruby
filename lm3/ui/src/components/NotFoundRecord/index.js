import React from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { goBack } from 'react-router-redux';

import { Button } from 'reactstrap';

const NotFoundRecord = ({ goBackRoute }) => (
  <div className="d-flex flex-column align-items-center">
    <h4 className="mb-5">Record not found</h4>

    <Button onClick={() => goBackRoute()}>
      Go Back
    </Button>
  </div>
);

NotFoundRecord.propTypes = {
  goBackRoute: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => bindActionCreators({
  goBackRoute: goBack,
}, dispatch);

export default connect(null, mapDispatchToProps)(NotFoundRecord);
