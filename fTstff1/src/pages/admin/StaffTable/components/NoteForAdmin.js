import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

class NoteForAdmin extends Component {
  render() {
    return (
      <StyledWrapper>
        <textarea
          name="noteforadmin"
          cols="30"
          rows="6"
          placeholder="Данное поле видно только вам, оставляйте здесь свои заметки по поводу стажера"
          value={this.props.value}
          onChange={this.props.onChange}
          onBlur={this.props.onBlur}
        />
      </StyledWrapper>
    );
  }
}

const StyledWrapper = styled.div`
  textarea {
    margin-top: 20px;
    border-color: #ccc;
    padding: 10px;
    font-size: 14px;
  }
`;

NoteForAdmin.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired
};

NoteForAdmin.defaultProps = {
  value: ''
};

export default NoteForAdmin;
