import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import MomentUtils from '@date-io/moment';
import moment from 'moment';

import {
  Typography,
  TextField
} from '@material-ui/core';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import {
  RadioTwoPicker,
  RichTextBox,
  DatePicker as DateTimePicker
} from 'ui';
import ImagesDownload from 'pages/sales/CreateProject/components/ImagesDownload';

class TaskEditForm extends Component {
  onDescriptionChange = (value) => {
    this.props.onChange({
      target: {
        name: 'description',
        value
      }
    });
  };

  render() {
    const {
      title,
      description,
      onChange,
      hidden,
      isStudent,
      changeSee,
      addImage,
      images,
      imagesSrc,
      visitDate,
      changeTime
    } = this.props;

    return (
      <>
        <Typography variant="h6" id="modal-title" gutterBottom>
          Название:
        </Typography>
        <StyledTextField
          name="title"
          value={title}
          onChange={onChange}
          margin="normal"
          variant="outlined"
          required
          autoFocus
        />
        <Typography gutterBottom noWrap>
          <b>Описание:</b>
        </Typography>
        <RichTextBox value={description} onChange={this.onDescriptionChange} />
        {!isStudent && (
          <>
            <ImagesDownload
              images={images}
              imagesSrc={imagesSrc}
              style={imagesDownloadStyle}
              addImage={addImage}
            />
            <StyledDate>
              <RadioTwoPicker
                value={hidden}
                onChange={changeSee}
                firstValue="hidden"
                firstLabel="Не показывать"
                secondValue="see"
                secondLabel="Показывать"
              />
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DateTimePicker
                  label="Дата"
                  value={visitDate}
                  onChange={changeTime}
                />
              </MuiPickersUtilsProvider>
            </StyledDate>
          </>
        )}
      </>
    );
  }
}

const StyledTextField = styled(TextField)`
  width: 100%;
`;

const StyledDate = styled.div`
  display: flex;
`;

const imagesDownloadStyle = {
  box: 'row col-md-6 col-12',
  label: 'col-md-3',
  imagesBox: 'col-md-9'
};

TaskEditForm.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  onChange: PropTypes.func,
  isStudent: PropTypes.bool,
  hidden: PropTypes.string,
  changeSee: PropTypes.func,
  addImage: PropTypes.func,
  images: PropTypes.arrayOf(PropTypes.any),
  imagesSrc: PropTypes.arrayOf(PropTypes.any),
  visitDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.instanceOf(moment)
  ]),
  changeTime: PropTypes.func
};

TaskEditForm.defaultProps = {
  title: '',
  description: '',
  onChange: () => null,
  isStudent: true,
  hidden: 'see',
  changeSee: () => null,
  addImage: () => null,
  changeTime: () => null,
  images: [],
  imagesSrc: [],
  visitDate: new Date()
};

export default TaskEditForm;
