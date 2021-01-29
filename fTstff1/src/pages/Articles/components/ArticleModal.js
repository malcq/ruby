import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import {
  TextField,
  FormControl,
  Button,
  Modal,
  Typography
} from '@material-ui/core';
import { SelectTags } from 'ui';

class RequestModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      href: ''
    };
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  selectedTags = (tags) => {
    this.setState({
      tags
    });
  };

  submit = () => {
    this.props.submit(this.state.href, this.state.tags);
    this.setState({
      tags: [],
      href: ''
    });
  };

  render() {
    return (
      <Modal
        style={style.modal}
        open={this.props.show}
        onClose={this.props.onHide}
      >
        <StyledModal>
          <Typography variant="h5">Добавить статью </Typography>
          <SelectCase>
            <Typography variant="body1">Ссылка:</Typography>
            <FormControl>
              <TextField
                variant="outlined"
                onChange={this.onChange}
                value={this.state.href}
                name="href"
                minLength="3"
                inputProps={{ className: 'article-input' }}
                type="text"
                style={{ maxHeight: '40px' }}
                margin="normal"
              />
            </FormControl>
            <Typography variant="body1">Теги:</Typography>

            <SelectTags
              change={this.selectedTags}
              value={this.state.tags}
              dataType="tags"
            />
          </SelectCase>

          <StyledFooter>
            <>
              <Button onClick={this.submit} className="accept-btn" size="small">
                Отправить
              </Button>
            </>
            <CancelButton
              onClick={this.props.onHide}
              className="decline-btn"
              size="small"
            >
              Отмена
            </CancelButton>
          </StyledFooter>
        </StyledModal>
      </Modal>
    );
  }
}

const style = {
  commentArea: {
    marginTop: '20px'
  },
  modal: {
    marginTop: '80px'
  },
  input: {
    textAlign: 'left'
  }
};

const StyledModal = styled.div`
  background-color: white;
  max-width: 50%;
  border-radius: 5px;
  padding: 4px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: 15px;
`;

const CancelButton = styled(Button)`
  float: right;
`;

const StyledFooter = styled.div`
  text-align: left;

  @media (max-width: 610px) {
    text-align: center;

    & .btn-group {
      width: auto;
      display: inline-block;
    }
  }
`;

const SelectCase = styled.div`
  width: 100%;
  min-width: 170px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

RequestModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func.isRequired,
  submit: PropTypes.func
};

RequestModal.defaultProps = {
  show: false,
  submit: () => null
};

export default RequestModal;
