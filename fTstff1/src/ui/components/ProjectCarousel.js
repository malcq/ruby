import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { avatarSelector } from 'utils';

import { Carousel } from 'react-responsive-carousel';

class ProjectCarousel extends Component {
  render() {
    const { project } = this.props;
    if (!project.images || !project.images.length) {
      return null;
    }

    return (
      <CarouselContainer>
        {project.images && (
          <Carousel showThumbs={false} infiniteLoop>
            {project.images.map((href) => {
              return (
                <div className="imageContainer" key={href}>
                  <img alt="screenshot" src={avatarSelector(href)} />
                </div>
              );
            })}
          </Carousel>
        )}
      </CarouselContainer>
    );
  }
}

const CarouselContainer = styled.div`
  width: 70%;
  min-width: 220px;
  margin: 0 auto;

  & .imageContainer {
    height: 380px;
    overflow: auto;
    background: grey;
    text-align: center;
  }

  & .imageContainer img {
    min-height: 100%;
    object-fit: contain;
    width: auto;
    max-width: 100%;
  }
`;

ProjectCarousel.propTypes = {
  project: PropTypes.objectOf(PropTypes.any).isRequired
};

ProjectCarousel.defaultProps = {};

export default ProjectCarousel;
