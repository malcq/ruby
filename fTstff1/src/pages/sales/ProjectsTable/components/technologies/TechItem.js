import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import classnames from 'classnames';

import api from 'api';
import { technologyImageSelector } from 'utils';

import { ConfirmModal } from 'ui';

class TechItem extends PureComponent {
  state = {
    isDeleteModalOpen: false
  };

  toggleDeleteModal = (ev) => {
    ev.stopPropagation();
    this.setState((state) => ({ isDeleteModalOpen: !state.isDeleteModalOpen }));
  };

  onEdit = () => {
    this.props.scrollToRef();
    this.props.onEdit(this.props.tech);
  };

  onDelete = () => {
    this.props.onDelete(this.props.tech.id, 'tech');
  };

  addAltSrc = (el) => {
    // eslint-disable-next-line
    el.target.src = technologyImageSelector(
      '/public/uploads/technology_icons/no_image.svg'
    );
  };

  setInputRef = (input) => {
    this.inputFile = input;
  };

  setImageRef = (input) => {
    this.svgImage = input;
  };

  activateInput = () => {
    this.inputFile.click();
  };

  loadFile = async () => {
    if (!this.inputFile.files[0]) {
      return;
    }
    let {
      tech: { title }
    } = this.props;
    title = title.replace(/[\W_]/g, '_').toLowerCase();
    const file = this.inputFile.files[0];
    try {
      const { data: res } = await api.updateTechnologyImage(title, file);
      this.svgImage.src = technologyImageSelector(
        `${res}?${new Date().getTime()}`
      );
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { tech, editable, className } = this.props;

    const src = tech.title
      ? technologyImageSelector(
        `/public/uploads/technology_icons/ic_${tech.title
          .toLowerCase()
          .replace(/[\W_]/g, '_')}.svg`
      )
      : null;

    return tech.title ? (
      <StyleLi className={classnames(className, { techless: !editable })}>
        <input
          ref={this.setInputRef}
          style={style.hiddenInput}
          onChange={this.loadFile}
          accept=".svg"
          name="technology_image"
          type="file"
          id="technology_image"
        />
        <img
          src={src}
          ref={this.setImageRef}
          style={{ backgroundColor: 'gray', borderRadius: 4 }}
          width={32}
          height={32}
          alt={tech.title}
          onClick={this.activateInput}
          onError={this.addAltSrc}
        />
        <StyledSpan>{tech.title}</StyledSpan>

        {!editable ? null : (
          <React.Fragment>
            <i className="far fa-edit edit-icon" onClick={this.onEdit} />

            <i
              className="far fa-trash-alt delete-icon"
              onClick={this.toggleDeleteModal}
            />
          </React.Fragment>
        )}

        <ConfirmModal
          open={this.state.isDeleteModalOpen}
          onClose={this.toggleDeleteModal}
          onAccept={this.onDelete}
          title={`Вы действительно хотите удалить технологию ${tech.title}?`}
        />
      </StyleLi>
    ) : (
      <StyleLi>{'Нет технологий'}</StyleLi>
    );
  }
}

const style = {
  hiddenInput: {
    display: 'none'
  }
};

const StyledSpan = styled.span`
  min-width: 100px;
`;

const StyleLi = styled.li`
  background-color: white;
  transition: 0.2s;
  padding: 5px 0;
  padding-left: 40px;
  cursor: all-scroll;
  display: flex;
  align-items: center;

  :hover {
    background-color: rgba(128, 128, 128, 0.1);
  }

  img {
    margin-right: 10px;
  }

  i {
    margin-left: 5px;
  }

  .edit-icon,
  .delete-icon {
    cursor: pointer;
  }

  &.techless {
    cursor: default;

    :hover {
      background-color: unset;
    }
  }
`;

TechItem.propTypes = {
  tech: PropTypes.objectOf(PropTypes.any),
  editable: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  className: PropTypes.string,
  scrollToRef: PropTypes.func
};

TechItem.defaultProps = {
  tech: {},
  editable: false,
  onEdit: () => null,
  onDelete: () => null,
  className: '',
  scrollToRef: () => null
};

export default TechItem;
