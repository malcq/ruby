import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import classnames from 'classnames';

import { ConfirmModal } from 'ui';

class GroupItem extends PureComponent {
  state = {
    isDeleteModalOpen: false
  };

  toggleDeleteModal = () => {
    this.setState((state) => ({ isDeleteModalOpen: !state.isDeleteModalOpen }));
  };

  onEdit = () => {
    this.props.scrollToRef();
    this.props.onEdit(this.props.group);
  };

  onDelete = () => {
    this.toggleDeleteModal();
    this.props.onDelete(this.props.group.id, 'group');
  };

  render() {
    const { group, className, editable } = this.props;

    return (
      <StyledH4 className={classnames(className, { groupless: !editable })}>
        {group.title || 'Без группы'}

        {!editable ? null : (
          <>
            <i onClick={this.onEdit} className="far fa-edit edit-icon" />

            <i
              className="far fa-trash-alt delete-icon"
              onClick={this.toggleDeleteModal}
            />
          </>
        )}

        <ConfirmModal
          open={this.state.isDeleteModalOpen}
          onClose={this.toggleDeleteModal}
          onAccept={this.onDelete}
          title={`Вы действительно хотите удалить группу ${group.title}?`}
        />
      </StyledH4>
    );
  }
}

const StyledH4 = styled.h4`
  transition: 0.2s;
  padding: 5px 0;
  padding-left: 20px;
  margin-bottom: 0;

  :hover {
    background-color: rgba(128, 128, 128, 0.1);
  }

  .edit-icon,
  .delete-icon {
    cursor: pointer;
  }

  &.groupless {
    :hover {
      background-color: unset;

      i {
        display: inline-block;
      }
    }
  }
`;

GroupItem.propTypes = {
  group: PropTypes.objectOf(PropTypes.any),
  editable: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  className: PropTypes.string,
  scrollToRef: PropTypes.func
};

GroupItem.defaultProps = {
  group: {},
  editable: false,
  onEdit: () => null,
  onDelete: () => null,
  className: '',
  scrollToRef: () => null
};

export default GroupItem;
