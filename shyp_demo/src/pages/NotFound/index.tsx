import React, { StatelessComponent } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './styles.scss';

interface INotFoundPageProps{

}

const NotFoundPage: StatelessComponent<any> = (props: INotFoundPageProps) => (
  <section className="not-found-page">
    <header className="not-found-page__header">
      <Link to="/" className="not-found-page__header-brand">
        <i className="not-found-page__header-brand-icon icon shypple" />
        <div className="not-found-page__header-brand-name">Shypple</div>
      </Link>
      <nav className="not-found-page__header-nav">
        <Link to="/login" className="not-found-page__header-nav-button">
          Log in
        </Link>
      </nav>
    </header>
    <article className="not-found-page__content">
      <div className="not-found-page__content-message">
        <div className="not-found-page__content-message-code">404</div>
        <div className="not-found-page__content-message-text">
          Oops. The page you were looking for doesn't exist.
        </div>
        <Link
          to="/dashboard"
          className="not-found-page__content-message-link"
        >
          Go back to dashboard
        </Link>
      </div>
    </article>
  </section>
);

NotFoundPage.propTypes = {
};

NotFoundPage.defaultProps = {
};

export default NotFoundPage;