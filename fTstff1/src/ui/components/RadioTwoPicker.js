import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import {
  FormControlLabel,
  Radio,
  RadioGroup
} from '@material-ui/core';

function RadioTwoPicker(props) {
  const {
    value,
    onChange,
    firstValue,
    firstLabel,
    secondValue,
    secondLabel
  } = props;

  return (
    <StyledContainer>
      <RadioGroup className="flex-container" value={value} onChange={onChange}>
        <FormControlLabel
          value={firstValue}
          control={<Radio color="primary" />}
          label={firstLabel}
        />
        <FormControlLabel
          value={secondValue}
          control={<Radio color="primary" />}
          label={secondLabel}
        />
      </RadioGroup>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  .flex-container {
    display: flex;
    margin: 25px 0 0 0;
    flex-direction: row;
  }
`;

RadioTwoPicker.propTypes = {
  value: PropTypes.string,
  firstValue: PropTypes.string,
  firstLabel: PropTypes.string,
  secondValue: PropTypes.string,
  secondLabel: PropTypes.string,
  onChange: PropTypes.func
};

RadioTwoPicker.defaultProps = {
  onChange: () => null,
  value: '',
  firstValue: '',
  secondValue: '',
  firstLabel: '',
  secondLabel: ''
};

export default RadioTwoPicker;
