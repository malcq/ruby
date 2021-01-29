import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Url from 'urls-tool';
import styled from 'styled-components';
import moment from 'moment';

import {
  Button,
  Menu,
  MenuItem,
  IconButton
} from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import ProjectInfoModal from 'pages/sales/ProjectsTable/components/ProjectInfoModal';

import config from 'config';
import { paramsNames } from 'utils/constants';

export default class ArticleItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      showInfo: this.props.opened
    };
  }

  handleMenu = (event) => {
    event.preventDefault();
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  toggleInfoModal = (e) => {
    if (!this.props.isArticle) {
      if (e) {
        e.preventDefault();
      }

      // the window opens
      if (!this.state.showInfo) {
        Url.params = [paramsNames.announcementsId, this.props.data.id];
      } else {
        Url.params = [paramsNames.announcementsId];
      }

      this.setState((state) => ({
        showInfo: !state.showInfo
      }));
    }
  };

  toggleSideMenu = () => {
    this.setState((state) => {
      return { sideMenuIsOpen: !state.sideMenuIsOpen };
    });
  };

  deleteArticle = () => {
    const articleID = this.props.data.id;
    this.props.deleteArticle(articleID);
  };

  render() {
    const { anchorEl, showInfo } = this.state;
    let { image = '', createdAt } = this.props.data;
    const {
      link = '',
      images = [],
      title = '',
      url = '',
      tags,
      description = '',
      clickTag
    } = this.props.data;

    image = image || (images.length ? images[0] : undefined);
    createdAt = createdAt ? moment(createdAt).format('DD MMM YYYY') : '';
    const open = Boolean(anchorEl);
    const styleHeight = link ? {} : { height: 'auto' };

    return (
      <>
        {showInfo && (
          <ProjectInfoModal
            show={showInfo}
            onHide={this.toggleInfoModal}
            project={this.props.data}
            isProject={false}
          />
        )}

        {this.props.opened ? null : (
          <StyledItem className="float-animation">
            <a
              className="previewlink"
              href={link}
              onClick={this.toggleInfoModal}
              target="blank"
            >
              <div className="previewlink-container" style={styleHeight}>
                {image && (
                  <img
                    src={`${!this.props.isArticle ? config.url : ''}${image}`}
                    alt="preview"
                    className="previewlink-img"
                  />
                )}
                <div className="previewlink-info">
                  <h4 className="previewlink-title">{title}</h4>

                  {tags && this.props.globalUser.role === 'admin' && (
                    <>
                      <IconButton
                        style={{
                          position: 'absolute',
                          bottom: '5px',
                          right: '5px'
                        }}
                        onClick={this.handleMenu}
                        aria-owns={open ? 'menu-appbar' : null}
                        aria-haspopup="true"
                      >
                        <Delete />
                      </IconButton>
                      <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right'
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right'
                        }}
                        open={open}
                        onClose={this.handleClose}
                      >
                        <MenuItem onClick={this.deleteArticle}>
                          Удалить статью
                        </MenuItem>
                      </Menu>
                    </>
                  )}
                  {tags
                    ? (
                      <p className="previewlink-description">{description}</p>
                    )
                    : (
                      <div
                        className="insertHTML"
                        dangerouslySetInnerHTML={
                          { __html: description } // eslint-disable-next-line
                        }
                      />
                    )}
                  {createdAt && (
                    <div>
                      <h6 className="text-created-at"> {createdAt} </h6>
                    </div>
                  )}

                  {url && (
                    <div>
                      {url && <p className="previewlink-url">{url}</p>}
                      {tags &&
                        tags.map((el) => (
                          <Button
                            key={el.id}
                            onClick={(e) => clickTag(e, el.id)}
                          >
                            {el.title}
                          </Button>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </a>
          </StyledItem>
        )}
      </>
    );
  }
}

const StyledItem = styled.div`
  .insertHTML p {
    margin: 5px 0 0 0;
    font-family: Verdana, Geneva, sans-serif;
    font-size: 14px;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    word-break: break-word;
  }

  .text-created-at {
    text-align: right;
    margin: 5px 10px;
    vertical-align: bottom;
  }
`;

ArticleItem.propTypes = {
  data: PropTypes.shape().isRequired,
  globalUser: PropTypes.shape(),
  clickTag: PropTypes.func,
  deleteArticle: PropTypes.func,
  isArticle: PropTypes.bool,
  opened: PropTypes.bool
};

ArticleItem.defaultProps = {
  clickTag: () => null,
  deleteArticle: () => null,
  isArticle: true,
  opened: false,
  globalUser: undefined
};
