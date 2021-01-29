import React, {
  StatelessComponent, ReactNodeArray, ReactNode,
  SyntheticEvent
} from 'react';
import PropTypes from  'prop-types';

import { FormFieldGroup, Paper, Button } from '../';
import './styles.scss'

interface IFormLayout {
  cancel?: (event: SyntheticEvent) => void;
  label?: string;
  buttonText?: string;
  disabled?: boolean;
  icon?: IconType;
  contentClassName?: string,
  hoverContentClassName?: string,
  children: ReactNode | ReactNodeArray;
  submit: (event: SyntheticEvent) => void;
  nosubmit: boolean;
  hover?: boolean;
  buttonColor?: string;
  rightCornerContent?: ReactNode;
  footer?: ReactNode;
}


// Frame for account form. Has title with icon and submit button.
// Fields should be located inside and controlled outside the component
const FormLayout: StatelessComponent<any> = (props: IFormLayout) => (
  <Paper
    className="form-layout"
  >
    <header className="form-layout__header">
      <div className="form-layout__title">
        <i className={`form-layout__title-icon icon ${props.icon}`} />
        <div className="form-layout__title-text">
          { props.label }
        </div>
      </div>
      {props.rightCornerContent}
    </header>
    <div className={`
      form-layout__content
        ${props.contentClassName}
        ${props.hover ? props.hoverContentClassName : ''}
       `}>
      { props.children }
    </div>
    { (!props.nosubmit) && (
      <div className="form-layout__container-button">
        <FormFieldGroup align="center">
          { (props.cancel) && (
            <div className="form-layout__container-button_cancel">
              <Button
                color="blue-border"
                full-width={true}
                onClick={props.cancel}
              >
                Cancel
              </Button>
            </div>
          )}
          <Button
            disabled={props.disabled}
            color={props.buttonColor}
            onClick={props.submit}
          >
            { props.buttonText }
          </Button>
        </FormFieldGroup>
      </div>
    )}
    {props.footer}
  </Paper>
);

FormLayout.propTypes = {
  submit: PropTypes.func,
  cancel: PropTypes.func,
  buttonText: PropTypes.string,
  disabled: PropTypes.bool,
  icon: PropTypes.string,
  label: PropTypes.string,
  buttonColor: PropTypes.string,
  rightCornerContent: PropTypes.node,
  footer: PropTypes.node,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ])
};

FormLayout.defaultProps = {
  submit: (event: SyntheticEvent): void => {},
  label: '',
  buttonText: 'submit',
  icon: 'none',
  buttonColor: 'blue',
  children: '',
  disabled: false,
  rightCornerContent: '',
  contentClassName: '',
  hoverContentClassName: '',
  footer: '',
};

export default FormLayout;