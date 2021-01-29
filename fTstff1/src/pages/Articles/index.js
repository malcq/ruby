import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { toast } from 'react-toastify';

import {
  deleteArticleRequest,
  createNewArticleRequest,
  getAllArticlesRequest,
  getFilteredArticlesRequest
} from 'api/articlesApi';
import { connectGlobalUser } from 'store/connections';

import {
  Grid,
  Typography
} from '@material-ui/core';
import ArticleItem from './components/ArticleItem';
import Filter from './components/Filters';
import ArticleModal from './components/ArticleModal';

class Articles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      showModal: false
    };
  }

  async componentDidMount() {
    try {
      const { data } = await getAllArticlesRequest();
      this.setState({
        articles: data.articles
      });
    } catch (err) {
      console.log(err);
    }
  }

  applyFilter = async (filter) => {
    const { data } = await getFilteredArticlesRequest(filter);
    this.setState({
      articles: data.articles
    });
  };

  onHide = () => {
    this.setState({
      showModal: false
    });
  };

  showModal = (e) => {
    e.target.focus = false;
    this.setState({
      showModal: true
    });
  };

  clickTag = (e, id) => {
    e.preventDefault();
    const filter = {
      users: [],
      title: '',
      tags: [id]
    };
    return this.applyFilter(filter);
  };

  deleteArticle = async (articleID) => {
    const { data } = await deleteArticleRequest(articleID);
    this.setState({
      articles: data.articles
    });
  };

  submit = async (href, tags) => {
    try {
      const response = await createNewArticleRequest(href, tags);
      const { article } = response.data;
      this.setState((state) => {
        state.articles.push(article);
      });
      toast.success('Статья успешно добавлена');
    } catch (e) {
      toast.error(`Ошибка ${e}!`);
    }
    this.setState({
      showModal: false
    });
  };

  render() {
    return (
      <StyledContainer className="container">
        <Grid container spacing={24} alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h4" className="page-title">
              Статьи
            </Typography>
            <Filter applyFilter={this.applyFilter} showModal={this.showModal} />
          </Grid>
          {this.state.articles.length
            ? (
              this.state.articles.map((data) => (
                <Grid item lg={4} md={6} key={data.id}>
                  <ArticleItem
                    data={data}
                    globalUser={this.props.user}
                    clickTag={this.clickTag}
                    deleteArticle={this.deleteArticle}
                  />
                </Grid>
              ))
            )
            : (
              <h3>Нет загруженных статей</h3>
            )}
        </Grid>
        <ArticleModal
          show={this.state.showModal}
          onHide={this.onHide}
          submit={this.submit}
          type="send"
          senderID={this.props.user.id}
        />
      </StyledContainer>
    );
  }
}

const StyledContainer = styled.div`
  padding-top: 30px;
  padding-bottom: 150px;
  max-width: 90%;
  margin: 0 auto;

  .pageTitle {
    padding-bottom: 30px;
    text-align: center;
  }
`;

Articles.propTypes = {
  user: PropTypes.shape().isRequired
};

export default connectGlobalUser(Articles);
