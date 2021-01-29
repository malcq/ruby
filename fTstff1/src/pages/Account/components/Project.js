import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { Paper } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';
import { ProjectCarousel } from 'ui';

class Project extends Component {
  render() {
    const { project } = this.props;
    return (
      <>
        <Paper style={{ marginBottom: '20px' }}>
          <PanelHeader>
            <b>{project.title}</b>
          </PanelHeader>

          <PanelBody>
            <ProjectCarousel project={project} />
            <br />

            <div style={style.linkContainer}>
              <a href={project.href}>{project.href}</a>
            </div>

            <br />
            <b>О проекте: </b>
            <br />
            <ReactMarkdown source={project.description} escapeHtml={false} />
          </PanelBody>

          <PanelFooter>
            <b>Технологии: </b>
            {project.technologies &&
              project.technologies.map((technologi, index) => {
                const id = index;
                return (
                  <Fragment key={id}>
                    <a
                      href="/"
                      style={style.technologiText}
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      {technologi.title}
                    </a>
                    {index !== project.technologies.length - 1 ? ', ' : '.'}
                  </Fragment>
                );
              })}
          </PanelFooter>
        </Paper>
      </>
    );
  }
}

const PanelHeader = styled(Paper)`
  && {
    text-align: center;
    background-color: #f5f5f5;
    padding: 10px 0;
  }
`;

const PanelFooter = styled(Paper)`
  && {
    background-color: #f5f5f5;
    padding: 10px 0 10px 10px;
  }
`;

const PanelBody = styled(Paper)`
  && {
    padding: 10px 0 10px 10px;
  }
`;

const style = {
  technologiText: { cursor: 'pointer' },
  panelTitle: { textAlign: 'center' },
  linkContainer: { textAlign: 'center' }
};

Project.propTypes = {
  project: PropTypes.objectOf(PropTypes.any).isRequired
};

export default Project;
