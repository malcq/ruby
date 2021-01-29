import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { PDFReader } from 'reactjs-pdf-reader';

class PdfViewer extends Component {
  render() {
    const {
      numPages,
      url,
      filename,
      pageNumber,
      onChange,
      onPrev,
      onNext
    } = this.props;

    return (
      <StyledContainer>
        <a href={url} download={filename}>
          {' Скачать '}
        </a>
        {numPages > 1 && (
          <div className="btn-group-page">
            <i className="icon-padding fas fa-arrow-left" onClick={onPrev} />
            {pageNumber}
            <i className="icon-padding fas fa-arrow-right" onClick={onNext} />
          </div>
        )}
        <PDFReader url={url} page={pageNumber} onDocumentComplete={onChange} />
      </StyledContainer>
    );
  }
}

const StyledContainer = styled.div`
  .icon-padding {
    padding: 0 5px;
  }
  .btn-group-page {
    text-align: center;
  }

  #my-pdf {
    &,
    canvas {
      max-width: 100%;
      height: auto !important;
    }
  }
`;

PdfViewer.propTypes = {
  numPages: PropTypes.number,
  url: PropTypes.string,
  filename: PropTypes.string,
  pageNumber: PropTypes.number,
  onChange: PropTypes.func,
  onNext: PropTypes.func,
  onPrev: PropTypes.func
};

PdfViewer.defaultProps = {
  filename: 'FILE',
  onChange: () => null,
  onNext: () => null,
  onPrev: () => null,
  numPages: null,
  pageNumber: 1,
  url: null
};

export default PdfViewer;
