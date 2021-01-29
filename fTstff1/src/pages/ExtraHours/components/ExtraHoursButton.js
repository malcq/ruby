import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  Grid,
  Button,
  Tooltip
} from '@material-ui/core';

class Filter extends Component {
  render() {
    const { handleCreateModal, count } = this.props;

    return (
      <StyledContainer>
        <Grid item xs={12}>
          <div className="relative-container ">
            <Tooltip
              title="Добавить переработку"
              placement="right"
              className="open-cv"
            >
              <StyledButton
                onClick={handleCreateModal}
                variant="outlined"
                style={count === 0 ? extraButtonColor : extraButton}>
                Добавить переработку
              </StyledButton>
            </Tooltip>
          </div>
        </Grid>
      </StyledContainer>
    );
  }
}

Filter.propTypes = {
  handleCreateModal: PropTypes.func.isRequired,
  count: PropTypes.number,
};

Filter.defaultProps = {
  count: 0,
};

const StyledContainer = styled.div`
  padding-top: 30px;
`;

const StyledButton = styled(Button)`
  & {
    margin-bottom: 10px;
    border: 1px solid #A79DB1;
    font-size: 14px;
    font-style: normal;
    && {
    font-weight: bold;
    line-height: 19px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 9.5px 32px;
    }
  }
`;

const extraButtonColor = {
  backgroundColor: '#B163FF',
  color: '#fff',
};
const extraButton = {
  backgroundColor: '#e5e5e5',
  color: '#7b7b7b',
};

export default Filter;
