import React, { memo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import SelectWrapper from './SelectWrapper';

const FormSelect = (props) => {
  const {
    children,
    title,
    className
  } = props;

  const containerclassName = classnames(
    'form-field',
    'form-field__container', {
      [className]: className
    }
  );

  return (
    <Container
      className={containerclassName}
    >
      {title && (
        <h4 className="form-field__title">{title}</h4>
      )}
      <SelectWrapper className="form-field__field">
        {children}
      </SelectWrapper>
    </Container>
  );
};

const Container = styled.div`
  .form-field__title {}

  .form-field__field {}
`;

FormSelect.propTypes = {
  children: PropTypes.node,
  title: PropTypes.node,
  className: PropTypes.string
};

FormSelect.defaultProps = {
  children: null,
  title: null,
  className: ''
};

export default memo(FormSelect);
