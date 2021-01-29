import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Url from 'urls-tool';

import {
  Typography,
  CssBaseline,
  createMuiTheme,
  MuiThemeProvider,
  Grid
} from '@material-ui/core';
import Pagination from 'material-ui-flat-pagination';
import ArticleItem from 'pages/Articles/components/ArticleItem';
import { UsersList } from 'ui';

import logo from 'ui/images/logo.svg';
import { getAllAnnouncements, getAnnouncement } from 'api/announcementApi';
import { paramsNames } from 'utils/constants';
import { connectGlobalUser } from 'store/connections';

const theme = createMuiTheme();

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      announcements: [],
      openedAnnouncement: undefined,
      perPage: 10,
      page: 1,
      pagesCount: 1
    };
  }

  componentDidMount() {
    const { user } = this.props;
    if (user && user.status !== 'registered') {
      this.getAnnouncements();
      this.getOpenedAnnouncement();
    }
  }

  getOpenedAnnouncement = async () => {
    const announcementsId = Url.params[paramsNames.announcementsId];

    if (announcementsId) {
      try {
        const { data } = await getAnnouncement(announcementsId);
        this.setState({
          openedAnnouncement: data
        });
      } catch (err) {
        console.log('Error in getAnnouncement function: ', err);
      }
    }
  };

  handleClick = async (page) => {
    this.setState({ page }, this.getAnnouncements);
  };

  getAnnouncements = async () => {
    try {
      const {
        data: { data: announcements, pagesCount }
      } = await getAllAnnouncements({
        sort: ['createdAt', 'DESC'],
        filter: { title: '', hidden: false },
        page: this.state.page,
        perPage: this.state.perPage
      });
      this.setState({
        announcements,
        pagesCount
      });
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { user } = this.props;
    const {
      announcements,
      openedAnnouncement,
      perPage,
      pagesCount,
      page
    } = this.state;

    return (
      <StyledContainer className="container">
        <Typography variant="h3" className="page-title">
          Добро пожаловать
          {user && user.firstName && `, ${user.firstName}`}!
        </Typography>

        <Grid container>
          <Grid item sm={6} xs={12} className="adsList">
            {user &&
              announcements.length > 0 &&
              user.status !== 'registered' ? (
                <>
                  {announcements.map((data) => (
                    <Grid
                      item
                      lg={8}
                      md={8}
                      key={data.id}
                      style={{
                        padding: '12px',
                        margin: 'auto'
                      }}
                    >
                      <ArticleItem
                        data={data}
                        user={this.props.user}
                        isArticle={false}
                      />
                    </Grid>
                  ))}

                  {openedAnnouncement && (
                    <ArticleItem
                      data={openedAnnouncement}
                      user={this.props.user}
                      isArticle={false}
                      opened
                    />
                  )}

                  {pagesCount > 1 && (
                    <>
                      <MuiThemeProvider theme={theme}>
                        <CssBaseline />
                        <Pagination
                          limit={perPage}
                          offset={(page - 1) * perPage}
                          total={pagesCount * perPage}
                          onClick={(e, offset) => this.handleClick(offset / perPage + 1)
                          }
                        />
                      </MuiThemeProvider>
                    </>
                  )}
                </>
              ) : (
                <img src={logo} alt="logoImage" />
              )}
          </Grid>

          {user && user.status === 'active' && (
            <Grid item sm={6} xs={12}>
              <UsersList class="usersList" />
            </Grid>
          )}
        </Grid>
      </StyledContainer>
    );
  }
}

const StyledContainer = styled.div`
  text-align: center;
  padding-bottom: 150px;

  & .usersList {
    margin-top: 40px;
  }

  & .adsList {
    margin-top: 29px;
  }

  & .logo {
    margin: 0 auto;
    width: 60%;
  }

  & object {
    width: 80%;
  }

  @media (max-width: 590px) {
    .page-title {
      font-size: 2rem;
      line-height: 1.2;
    }
  }
`;

Home.propTypes = {
  user: PropTypes.objectOf(PropTypes.any)
};

Home.defaultProps = {
  user: null
};

export default connectGlobalUser(Home);
