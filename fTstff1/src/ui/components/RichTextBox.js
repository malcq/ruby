import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ReactQuill from 'react-quill';
import { TextField } from '@material-ui/core';

class RichTextBox extends Component {
  render() {
    const {
      value,
      title,
      onChange,
      count,
      withTitleInput,
      roleTitle,
      onTitleChange
    } = this.props;

    const valueString =
      count && value ? value.replace(/<(?:.|\n)*?>/gm, '').length : 0;

    return (
      <div>
        {title && (
          <h4 className="project-field-title">
            {`${title} ${count ? `(${valueString})` : ''}`}
          </h4>
        )}
        {withTitleInput && (
          <TextField
            type="text"
            label="Роль"
            margin="dense"
            value={roleTitle}
            variant="outlined"
            onChange={onTitleChange}
          />
        )}
        <ReactQuill
          value={value}
          name={value}
          onChange={onChange}
          formats={formats}
          modules={modules}
          autoFocus
        />
      </div>
    );
  }
}

RichTextBox.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
  roleTitle: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onTitleChange: PropTypes.func,
  count: PropTypes.bool,
  withTitleInput: PropTypes.bool
};

RichTextBox.defaultProps = {
  onTitleChange: () => null,
  title: '',
  roleTitle: '',
  withTitleInput: false,
  count: false,
  value: ''
};

const formats = [
  'font',
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'code',
  'code-block',
  'align',
  'list',
  'bullet',
  'link',
  'color',
  'background'
];

const modules = {
  toolbar: [
    [
      { font: ['sans-serif', 'serif', 'monospace'] },
      { header: [1, 2, 3, 4, false, 5, 6] }
    ],
    [
      'bold',
      'italic',
      'underline',
      'strike',
      'blockquote',
      'code',
      'code-block'
    ],
    [{ align: [false, 'center', 'right', 'justify'] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    [
      {
        color: [
          'black',
          '#e20000',
          '#b57603',
          '#dede00',
          'green',
          '#0000ea',
          'purple',
          'grey',
          'red',
          'orange',
          'yellow',
          '#00c300',
          '#7979ff',
          '#c700c7',
          '#d4d4d4',
          '#ff7575',
          '#ffd382',
          '#ffffb0',
          '#01ff01',
          '#b4b4ff',
          '#ff09ff',
          'white',
          '#ffc4c4',
          '#ffefd2',
          '#ffffe7',
          '#bfffbf',
          '#e6e6ff',
          '#ffb9ff'
        ]
      },
      {
        background: [
          'black',
          '#e20000',
          '#b57603',
          '#dede00',
          'green',
          '#0000ea',
          'purple',
          'grey',
          'red',
          'orange',
          'yellow',
          '#00c300',
          '#7979ff',
          '#c700c7',
          '#d4d4d4',
          '#ff7575',
          '#ffd382',
          '#ffffb0',
          '#01ff01',
          '#b4b4ff',
          '#ff09ff',
          'white',
          '#ffc4c4',
          '#ffefd2',
          '#ffffe7',
          '#bfffbf',
          '#e6e6ff',
          '#ffb9ff'
        ]
      }
    ],
    ['clean']
  ]
};

export default RichTextBox;
