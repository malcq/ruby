import React from 'react';
import PropTypes from 'prop-types';

import { Container } from 'react-smooth-dnd';

const DraggableUserJobs = ({ onDrop, children }) => (
  <Container
    onDrop={onDrop}
    animationDuration={400}
    lockAxis="y"
    dragClass="drag-start"
    dropClass="drag-end"
    nonDragAreaSelector="true"
  >
    {children}
  </Container>
);

DraggableUserJobs.propTypes = {
  onDrop: PropTypes.func,
  children: PropTypes.element
};

DraggableUserJobs.defaultProps = {
  onDrop: () => null
};

export default DraggableUserJobs;
