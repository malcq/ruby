import React, { StatelessComponent, ReactNode, ReactNodeArray } from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

interface IFormFieldGroup{
  align?: AlignType,
  children?: ReactNode | ReactNodeArray,
  label?: string
}


// Component what handles field positioning in the form with possibility of adding label on the left.
const FormFieldGroup: StatelessComponent<any> = (props: IFormFieldGroup) => (
  <div className="form-field-group">
    <div className="form-field-group__label">
      {props.label}
    </div>
    <div className={`form-field-group__content form-field-group__content_align-${props.align}`}>
      {props.children}
    </div>
  </div>
);

FormFieldGroup.propTypes = {
  label: PropTypes.string,
  align: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ])
};

FormFieldGroup.defaultProps = {
  label: '',
  align: 'right',
  children: '',
};

export default FormFieldGroup;