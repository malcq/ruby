import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import map from 'lodash/map';
import noop from 'lodash/noop';

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import ConfirmableDelete from 'components/ConfirmableDelete';

import { ReactUtils } from 'utils';

import Col from '../Col';

class ActionsCol extends PureComponent {
  static propTypes = {
    buttons: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.oneOf(['standard', 'link', 'delete']).isRequired,
      text: PropTypes.string.isRequired,
      url: PropTypes.string,
      className: PropTypes.string,
      onClick: PropTypes.func,
    })).isRequired,
  };

  renderButton = ({ type, ...button }) => {
    const props = {
      key: ReactUtils.getRandomInputId(),
      className: button.className,
    };

    if (button.onClick) {
      props.onClick = button.onClick;
    }

    switch (type) {
      case 'link':
        props.tag = Link;
        props.to = button.url;
        break;
      case 'delete':
        props.onClick = noop;
        props.onDelete = button.onClick;
        props.tag = ConfirmableDelete;
        break;
      default:
        props.tag = 'div';
    }

    return (
      <DropdownItem {...props}>
        {button.text}
      </DropdownItem>
    );
  };

  render() {
    const { buttons } = this.props;

    return (
      <Col className="actions">
        <UncontrolledDropdown size="sm" className="d-flex">
          <DropdownToggle caret className="ml-auto">
            More
          </DropdownToggle>

          <DropdownMenu right>
            {map(buttons, button => this.renderButton(button))}
          </DropdownMenu>
        </UncontrolledDropdown>
      </Col>
    );
  }
}

export default ActionsCol;
